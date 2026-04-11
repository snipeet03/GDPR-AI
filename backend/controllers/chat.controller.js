const Chat = require('../models/Chat');
const { semanticSearch } = require('../services/embedding.service');
const { generateChatResponse, generateChatTitle } = require('../services/groq.service');

exports.createChat = async (req, res) => {
  try {
    const chat = await Chat.create({ userId: req.user._id, messages: [], title: 'New Conversation' });
    res.status(201).json({ chat });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id, isArchived: false })
      .sort({ lastMessage: -1 }).select('title lastMessage messages createdAt').lean();
    res.json({ chats });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ chat });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = await Chat.create({ userId: req.user._id, messages: [], title: 'New Conversation' });
    }

    // Add user message
    chat.messages.push({ role: 'user', content: message });

    // RAG: retrieve context
    const contextResults = await semanticSearch(message, 5);

    // Generate response
    const chatHistory = chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
    const { content, metadata } = await generateChatResponse(message, contextResults, chatHistory);

    // Add assistant message
    const sources = contextResults.slice(0, 3).map(r => ({
      articleNumber: r.articleNumber || '',
      title: r.title || r.section || r.source,
      excerpt: r.content.substring(0, 200),
      relevanceScore: r.score
    }));

    chat.messages.push({ role: 'assistant', content, sources, metadata });
    chat.lastMessage = new Date();

    // Auto-title on first message
    if (chat.messages.length === 2 && chat.title === 'New Conversation') {
      chat.title = await generateChatTitle(message);
    }

    await chat.save();
    const lastMsg = chat.messages[chat.messages.length - 1];
    res.json({ message: lastMsg, chatId: chat._id, chatTitle: chat.title });
  } catch (e) {
    console.error('Chat error:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.bookmarkMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    const msg = chat.messages.id(messageId);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    msg.bookmarked = !msg.bookmarked;
    await chat.save();
    res.json({ bookmarked: msg.bookmarked });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.exportChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    const exportData = {
      title: chat.title,
      exportedAt: new Date().toISOString(),
      messages: chat.messages.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp }))
    };
    res.setHeader('Content-Disposition', `attachment; filename=chat-${chat._id}.json`);
    res.json(exportData);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
