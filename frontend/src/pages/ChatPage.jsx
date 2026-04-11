import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import WelcomeScreen from '../components/chat/WelcomeScreen'
import { useChatStore, useUIStore } from '../store/useStore'
import { chatAPI } from '../services/api'

export default function ChatPage() {
  const { chats, activeChat, messages, isLoading, setChats, setActiveChat, addMessage, setLoading, addChat, clearMessages } = useChatStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    chatAPI.getChats().then(r => setChats(r.data.chats)).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = () => clearMessages()

  const handleSelectChat = async (id) => {
    try {
      const { data } = await chatAPI.getChat(id)
      setActiveChat(data.chat)
    } catch {}
  }

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date() }
    addMessage(userMsg)
    setLoading(true)
    try {
      const { data } = await chatAPI.sendMessage({ message: text, chatId: activeChat?._id })
      addMessage(data.message)
      if (!activeChat) {
        const updatedChats = await chatAPI.getChats()
        setChats(updatedChats.data.chats)
        const newChat = updatedChats.data.chats.find(c => c._id === data.chatId)
        if (newChat) setActiveChat({ ...newChat, messages: [userMsg, data.message] })
      }
    } catch (err) {
      addMessage({ role: 'assistant', content: `Error: ${err}. Please try again.`, timestamp: new Date() })
    } finally { setLoading(false) }
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar onNewChat={handleNewChat} onSelectChat={handleSelectChat} />

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <div className="h-14 border-b border-surface-border glass-strong flex items-center px-4 gap-3 flex-shrink-0">
          {!sidebarOpen && (
            <button onClick={toggleSidebar} className="text-text-muted hover:text-text-secondary transition-colors">
              <Menu size={18} />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {activeChat?.title || 'GDPR AI Assistant'}
            </p>
            <p className="text-xs text-text-muted">Powered by Groq · RAG-enabled · No hallucination</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
            <span className="text-xs text-text-muted">Live</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggest={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto p-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-accent-cyan/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-3 h-3 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 border border-surface-border">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0,1,2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 bg-accent-cyan/50 rounded-full"
                          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
