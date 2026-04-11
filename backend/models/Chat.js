const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sources: [{
    articleNumber: String,
    title: String,
    excerpt: String,
    relevanceScore: Number
  }],
  bookmarked: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String,
    enum: ['positive', 'negative', null],
    default: null
  },
  metadata: {
    model: String,
    tokensUsed: Number,
    responseTime: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: 200
  },
  messages: [messageSchema],
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  lastMessage: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, lastMessage: -1 });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
