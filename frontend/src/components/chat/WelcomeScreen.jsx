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
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-10 sm:pt-20 w-full max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
        <div className="w-10 h-10 rounded-lg bg-surface border border-surface-border mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck size={20} className="text-text-primary" />
        </div>
        <h1 className="text-2xl font-medium text-text-primary mb-2">How can I help you today?</h1>
        <p className="text-text-muted text-sm max-w-md mx-auto">Expert GDPR and Cybersecurity assistance.</p>
      </motion.div>

      {/* Minimal prompts */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="flex flex-wrap justify-center gap-2">
        {TOPICS.slice(0, 4).map((t, i) => (
          <button key={i} onClick={() => onSuggest(t)}
            className="text-[12px] px-3 py-1.5 rounded-full border border-surface-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors">
            {t}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
