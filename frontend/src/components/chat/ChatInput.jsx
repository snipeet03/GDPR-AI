import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

const SUGGESTIONS = [
  "What does GDPR Article 32 require?",
  "Explain Zero Trust Architecture for hospitals",
  "What is a DPIA and when is it required?",
  "How does STRIDE threat modeling work?",
  "GDPR breach notification requirements",
  "What is Privacy by Design under Article 25?"
]

export default function ChatInput({ onSend, isLoading, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [value])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  return (
    <div className="p-4 border-t border-surface-border bg-bg-primary/80 backdrop-blur-sm">
      {/* Suggestions */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => { setValue(s); textareaRef.current?.focus() }}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-surface border border-surface-border hover:border-accent-blue/40 text-text-muted hover:text-text-secondary rounded-full transition-all whitespace-nowrap">
            {s}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="glass rounded-2xl border border-surface-border focus-within:border-accent-blue/40 transition-all p-3 flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about GDPR compliance, cybersecurity, or data protection..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm resize-none focus:outline-none leading-relaxed max-h-40"
        />
        <motion.button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading || disabled}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading ? <Loader2 size={16} className="text-bg-primary animate-spin" /> : <Send size={15} className="text-bg-primary" />}
        </motion.button>
      </div>
      <p className="text-xs text-text-muted text-center mt-2">Answers based on GDPR articles & cybersecurity documentation</p>
    </div>
  )
}
