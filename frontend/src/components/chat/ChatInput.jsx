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
    <div className="w-full flex flex-col gap-2">
      {/* Input box */}
      <div className="bg-bg-primary rounded-xl border border-surface-border focus-within:border-text-secondary transition-colors p-1 flex flex-col">
        <div className="flex items-end gap-2 p-1">
          <button className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center text-text-muted hover:text-text-primary transition-colors mb-1 flex-shrink-0 hidden sm:flex">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm resize-none focus:outline-none leading-relaxed max-h-40 py-2.5 px-1"
          />
          
          <motion.button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading || disabled}
            whileTap={{ scale: 0.95 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mb-1 ${value.trim() ? 'bg-text-primary text-bg-primary hover:opacity-80' : 'bg-transparent text-text-muted pointer-events-none'}`}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
          </motion.button>
        </div>
      </div>
      
      <p className="text-[10px] text-text-muted text-center tracking-wide">GDPR Assistant can make mistakes. Verify important information.</p>
    </div>
  )
}
