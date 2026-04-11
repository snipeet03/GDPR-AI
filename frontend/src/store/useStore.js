import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null, token: null, isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('gdpr_token', token)
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('gdpr_token')
    set({ user: null, token: null, isAuthenticated: false })
  },
  initAuth: () => {
    const token = localStorage.getItem('gdpr_token')
    if (token) set({ token, isAuthenticated: true })
  }
}))

export const useChatStore = create((set) => ({
  chats: [], activeChat: null, messages: [], isLoading: false,
  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat, messages: chat?.messages || [] }),
  addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
  setLoading: (v) => set({ isLoading: v }),
  addChat: (chat) => set(s => ({ chats: [chat, ...s.chats] })),
  removeChat: (id) => set(s => ({
    chats: s.chats.filter(c => c._id !== id),
    activeChat: s.activeChat?._id === id ? null : s.activeChat,
    messages: s.activeChat?._id === id ? [] : s.messages
  })),
  clearMessages: () => set({ messages: [], activeChat: null })
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
}))
