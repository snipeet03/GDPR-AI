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
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-10 sm:pt-20 w-full max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center mb-12">
        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-accent-cyan/90 to-accent-blue/90 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-accent-cyan/20">
          <ShieldCheck size={32} className="text-white absolute" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-3">Hi, I'm the GDPR Assistant</h1>
        <p className="text-text-muted text-base max-w-lg mx-auto">I can help you navigate GDPR compliance, understand cybersecurity protocols, and analyze incident response requirements.</p>
      </motion.div>

      {/* Quick start prompts - Grid aligned like modern AI */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3">
        {TOPICS.map((t, i) => (
          <button key={i} onClick={() => onSuggest(t)}
            className="text-left p-4 rounded-2xl bg-surface/40 hover:bg-surface border border-surface-border/50 hover:border-surface-border text-text-secondary hover:text-text-primary transition-all group flex flex-col gap-2">
            <span className="text-[13px] leading-relaxed">{t}</span>
            <div className="w-6 h-6 rounded-full bg-surface-border/30 group-hover:bg-bg-primary flex items-center justify-center transition-colors">
               <svg className="w-3 h-3 text-text-muted group-hover:text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  )
}
