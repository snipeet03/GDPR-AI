import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, User, Mail, Lock, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/useStore'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      localStorage.setItem('gdpr_token', data.token)
      setAuth(data.user, data.token)
      navigate('/chat')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-strong rounded-2xl p-8 relative z-10">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <ShieldCheck size={20} className="text-bg-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary">GDPR AI</h1>
            <p className="text-xs text-text-muted">Compliance Assistant</p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-text-primary mb-1">Create account</h2>
        <p className="text-text-secondary text-sm mb-6">Start your compliance journey</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Full name" required className="input-field pl-11"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="email" placeholder="Email address" required className="input-field pl-11"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="password" placeholder="Password (min 8 chars)" required minLength={8} className="input-field pl-11"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Have an account? <Link to="/login" className="text-accent-blue hover:text-accent-cyan transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
