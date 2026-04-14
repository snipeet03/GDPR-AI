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
    <div className="flex h-screen bg-bg-primary overflow-hidden relative">
      <Sidebar onNewChat={handleNewChat} onSelectChat={handleSelectChat} />

      {/* Main chat wrapper */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Floating Header */}
        <div className="absolute top-0 w-full z-20 h-14 flex items-center px-4 justify-between pointer-events-none bg-bg-primary border-b border-surface-border">
          <div className="flex items-center gap-2 pointer-events-auto">
            {!sidebarOpen && (
              <button onClick={toggleSidebar} className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-surface rounded-md">
                <Menu size={18} />
              </button>
            )}
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[13px] font-medium text-text-primary max-w-[200px] truncate">
                {activeChat?.title || 'GDPR Assistant'}
              </span>
            </div>
          </div>
          <div className="pointer-events-auto">
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto pb-32 pt-14 flex justify-center scrollbar-hide">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggest={handleSend} />
          ) : (
            <div className="w-full max-w-3xl px-4 sm:px-6 mt-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mb-8 w-full group">
                  <div className="w-6 h-6 rounded-md border border-surface-border bg-bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="w-2.5 h-2.5 border border-text-muted border-t-text-primary rounded-full animate-spin" />
                  </div>
                  <div className="flex items-center pt-1.5">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 bg-text-muted rounded-full"
                          animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Minimal Input Area */}
        <div className="absolute bottom-0 w-full bg-bg-primary pb-4 pt-4 pointer-events-none flex justify-center z-20">
          <div className="w-full max-w-3xl px-4 sm:px-6 pointer-events-auto">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
