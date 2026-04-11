import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Database, Users, MessageSquare, FileText, Zap, ArrowLeft } from 'lucide-react'
import { adminAPI } from '../services/api'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).catch(() => {})
  }, [])

  const handleSeed = async () => {
    setLoading(true); setSeedMsg('')
    try {
      const { data } = await adminAPI.seed()
      setSeedMsg(data.message || `Seeded ${data.count} articles`)
      const r = await adminAPI.getStats()
      setStats(r.data)
    } catch (e) {
      setSeedMsg(`Error: ${e}`)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/chat')} className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
            <ShieldCheck size={18} className="text-bg-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-text-primary">Admin Panel</h1>
            <p className="text-xs text-text-muted">GDPR AI Assistant management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Articles', value: stats?.articles ?? '—', icon: FileText, color: 'text-accent-blue' },
            { label: 'PDF Chunks', value: stats?.chunks ?? '—', icon: Database, color: 'text-accent-cyan' },
            { label: 'Users', value: stats?.users ?? '—', icon: Users, color: 'text-accent-purple' },
            { label: 'Chats', value: stats?.chats ?? '—', icon: MessageSquare, color: 'text-accent-green' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 border border-surface-border">
              <s.icon size={18} className={`${s.color} mb-2`} />
              <p className="text-2xl font-display font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="glass rounded-2xl border border-surface-border p-6 mb-4">
          <h2 className="font-display font-bold text-text-primary mb-4">Data Management</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-border">
              <div>
                <p className="text-sm font-medium text-text-primary">Seed GDPR Knowledge Base</p>
                <p className="text-xs text-text-muted mt-0.5">Load all GDPR articles and cybersecurity PDF data into the database</p>
              </div>
              <button onClick={handleSeed} disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 flex-shrink-0 ml-4">
                {loading ? <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" /> : <Zap size={14} />}
                Seed Data
              </button>
            </div>
          </div>
          {seedMsg && (
            <div className="mt-3 p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl text-accent-green text-sm">
              {seedMsg}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl border border-surface-border p-6">
          <h2 className="font-display font-bold text-text-primary mb-3">Setup Instructions</h2>
          <ol className="space-y-2 text-sm text-text-secondary">
            {[
              'Set GROQ_API_KEY in backend .env (get free key at console.groq.com)',
              'Set MONGODB_URI to your MongoDB Atlas connection string',
              'Click "Seed Data" above to populate the GDPR knowledge base',
              'The app will answer questions from seeded GDPR articles + PDF chunks',
              'Upload additional PDFs via the API endpoint POST /api/admin/upload-pdf'
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-blue/20 text-accent-blue text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
