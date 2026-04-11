import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('gdpr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gdpr_token')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data?.error || err.message || 'Request failed')
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
}

export const chatAPI = {
  getChats: () => api.get('/chat'),
  getChat: (id) => api.get(`/chat/${id}`),
  createChat: () => api.post('/chat'),
  sendMessage: (data) => api.post('/chat/message', data),
  deleteChat: (id) => api.delete(`/chat/${id}`),
  bookmark: (chatId, msgId) => api.patch(`/chat/${chatId}/messages/${msgId}/bookmark`),
  export: (id) => api.get(`/chat/${id}/export`)
}

export const articleAPI = {
  getArticles: (params) => api.get('/articles', { params }),
  getArticle: (num) => api.get(`/articles/${num}`),
  search: (q) => api.get('/articles/search', { params: { q } }),
  getStats: () => api.get('/articles/stats')
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  seed: () => api.post('/admin/seed'),
  uploadPDF: (data) => api.post('/admin/upload-pdf', data)
}

export default api
