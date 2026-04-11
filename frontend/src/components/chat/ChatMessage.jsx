import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, BookmarkPlus, BookmarkCheck, ShieldCheck, User, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ message, onBookmark }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${
        isUser ? 'bg-gradient-to-br from-accent-blue to-accent-purple' : 'bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-accent-cyan/30'
      }`}>
        {isUser ? <User size={15} className="text-white" /> : <ShieldCheck size={15} className="text-accent-cyan" />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-accent-blue to-accent-blue/80 text-white rounded-tr-sm'
            : 'glass border border-surface-border text-text-primary rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-text-primary prose-headings:font-display prose-strong:text-accent-cyan prose-code:text-accent-cyan prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-ul:my-1 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources.filter(s => s.title).slice(0, 3).map((src, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-accent-blue/8 border border-accent-blue/20 text-accent-blue rounded-full">
                <ExternalLink size={10} />
                {src.articleNumber ? `Art. ${src.articleNumber}` : src.title?.substring(0, 25)}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-secondary transition-all">
              {copied ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
            </button>
            {onBookmark && (
              <button onClick={() => onBookmark(message._id)} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-accent-blue transition-all">
                {message.bookmarked ? <BookmarkCheck size={13} className="text-accent-blue" /> : <BookmarkPlus size={13} />}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
