import { motion } from 'framer-motion'
import { ShieldCheck, Scale, Lock, Activity } from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, title: 'GDPR Articles', desc: 'All 99 articles indexed and searchable', color: 'text-accent-blue' },
  { icon: Scale, title: 'Compliance Guidance', desc: 'Articles 5, 25, 30, 32, 33, 35 covered', color: 'text-accent-cyan' },
  { icon: Lock, title: 'Cybersecurity', desc: 'Zero Trust, STRIDE, AES-256 & more', color: 'text-accent-purple' },
  { icon: Activity, title: 'Incident Response', desc: 'Detection, containment, recovery lifecycle', color: 'text-accent-green' },
]

const TOPICS = [
  "What are the key principles of GDPR Article 5?",
  "Explain Zero Trust Architecture principles",
  "What is required in a DPIA under Article 35?",
  "How should a hospital respond to a data breach?",
  "Describe STRIDE threat modeling methodology",
  "What encryption standards satisfy GDPR Article 32?"
]

export default function WelcomeScreen({ onSuggest }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan mx-auto mb-4 flex items-center justify-center shadow-lg glow-cyan">
          <ShieldCheck size={32} className="text-bg-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold gradient-text mb-2">GDPR AI Assistant</h2>
        <p className="text-text-secondary text-sm max-w-md">Ask anything about GDPR compliance and cybersecurity. All answers are grounded in official GDPR documentation.</p>
      </motion.div>

      {/* Feature cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3 w-full mb-6">
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="glass rounded-xl p-3.5 border border-surface-border hover:border-accent-blue/30 transition-all">
            <f.icon size={18} className={`${f.color} mb-2`} />
            <p className="text-text-primary text-sm font-medium">{f.title}</p>
            <p className="text-text-muted text-xs mt-0.5">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick start prompts */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full">
        <p className="text-xs text-text-muted text-center mb-3 uppercase tracking-wider">Quick start</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPICS.map((t, i) => (
            <button key={i} onClick={() => onSuggest(t)}
              className="text-left text-xs px-4 py-3 glass rounded-xl border border-surface-border hover:border-accent-blue/30 text-text-secondary hover:text-text-primary transition-all">
              {t}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
