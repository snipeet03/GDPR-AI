import axios from 'axios'

const normalizeBaseURL = () => {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (!configured) return ''
  return configured.replace(/\/+$/, '')
}

const getBaseURL = () => {
  const baseURL = normalizeBaseURL()
  if (!baseURL) return ''
  return baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`
}

const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const baseURL = getBaseURL()

  if (!baseURL) {
    return normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`
  }

  const withoutApiPrefix = normalizedPath.startsWith('/api')
    ? normalizedPath.slice(4) || '/'
    : normalizedPath

  return `${baseURL}${withoutApiPrefix.startsWith('/') ? withoutApiPrefix : `/${withoutApiPrefix}`}`
}

const api = axios.create({
  baseURL: getBaseURL(),
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
  register: (data) => api.post(buildUrl('/auth/register'), data),
  login: (data) => api.post(buildUrl('/auth/login'), data),
  getMe: () => api.get(buildUrl('/auth/me'))
}

export const chatAPI = {
  getChats: () => api.get(buildUrl('/chat')),
  getChat: (id) => api.get(buildUrl(`/chat/${id}`)),
  createChat: () => api.post(buildUrl('/chat')),
  sendMessage: (data) => api.post(buildUrl('/chat/message'), data),
  deleteChat: (id) => api.delete(buildUrl(`/chat/${id}`)),
  bookmark: (chatId, msgId) => api.patch(buildUrl(`/chat/${chatId}/messages/${msgId}/bookmark`)),
  export: (id) => api.get(buildUrl(`/chat/${id}/export`))
}

export const articleAPI = {
  getArticles: (params) => api.get(buildUrl('/articles'), { params }),
  getArticle: (num) => api.get(buildUrl(`/articles/${num}`)),
  search: (q) => api.get(buildUrl('/articles/search'), { params: { q } }),
  getStats: () => api.get(buildUrl('/articles/stats'))
}

export const adminAPI = {
  getStats: () => api.get(buildUrl('/admin/stats')),
  seed: () => api.post(buildUrl('/admin/seed')),
  uploadPDF: (data) => api.post(buildUrl('/admin/upload-pdf'), data)
}

export default api
