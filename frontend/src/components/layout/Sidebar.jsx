import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Trash2, Search, ShieldCheck, BookOpen, Settings, LogOut, ChevronLeft } from 'lucide-react'
import { useChatStore, useAuthStore, useUIStore } from '../../store/useStore'
import { chatAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ onNewChat, onSelectChat }) {
  const { chats, activeChat, removeChat } = useChatStore()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleDelete = async (e, chatId) => {
    e.stopPropagation()
    await chatAPI.deleteChat(chatId)
    removeChat(chatId)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const filtered = chats.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 glass-strong border-r border-surface-border z-30 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={16} className="text-bg-primary" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-text-primary">GDPR AI</span>
                  <p className="text-xs text-text-muted">Assistant</p>
                </div>
              </div>
              <button onClick={toggleSidebar} className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded-lg hover:bg-surface">
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* New Chat */}
            <div className="p-3">
              <button onClick={onNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue/10 to-accent-cyan/10 border border-accent-blue/20 text-accent-blue hover:from-accent-blue/20 hover:to-accent-cyan/20 transition-all text-sm font-medium">
                <Plus size={16} /> New conversation
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search chats..." className="w-full bg-surface border border-surface-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent-blue/40 transition-colors" />
              </div>
            </div>

            {/* Chats */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
              <p className="text-xs text-text-muted px-2 py-1 uppercase tracking-wider font-medium">Conversations</p>
              {filtered.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No conversations yet</p>
              )}
              {filtered.map(chat => (
                <motion.button key={chat._id} onClick={() => onSelectChat(chat._id)}
                  whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left group transition-all ${activeChat?._id === chat._id ? 'bg-accent-blue/10 border border-accent-blue/20 text-text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
                  <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
                  <span className="text-xs truncate flex-1">{chat.title || 'New Conversation'}</span>
                  <button onClick={e => handleDelete(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-0.5 rounded flex-shrink-0">
                    <Trash2 size={12} />
                  </button>
                </motion.button>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="p-3 border-t border-surface-border space-y-1">
              <button onClick={() => navigate('/admin')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-all ${user?.role !== 'admin' ? 'hidden' : ''}`}>
                <Settings size={14} /> Admin Panel
              </button>
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary truncate font-medium">{user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="text-text-muted hover:text-red-400 transition-colors flex-shrink-0">
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle button when closed */}
      {!sidebarOpen && (
        <button onClick={toggleSidebar}
          className="fixed left-4 top-4 z-30 w-9 h-9 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <MessageSquare size={16} />
        </button>
      )}
    </>
  )
}
