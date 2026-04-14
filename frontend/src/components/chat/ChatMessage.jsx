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
      className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-8 w-full`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${
        isUser ? 'bg-transparent border-surface-border' : 'bg-surface border-surface-border'
      }`}>
        {isUser ? <User size={16} className="text-text-muted" /> : <ShieldCheck size={16} className="text-text-primary" />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`text-[15px] leading-relaxed ${
          isUser
            ? 'bg-surface py-3 px-5 text-text-primary rounded-3xl rounded-tr-sm border border-surface-border/50'
            : 'text-text-primary pt-1.5'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-text-primary prose-headings:font-display prose-headings:font-medium prose-strong:text-text-primary prose-strong:font-semibold prose-code:text-accent-cyan prose-code:bg-surface/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-surface-border/30 prose-ul:my-2 prose-li:my-1">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.sources.filter(s => s.title).slice(0, 3).map((src, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 bg-surface/50 border border-surface-border text-text-secondary rounded-full hover:bg-surface hover:text-text-primary transition-colors cursor-pointer">
                <ExternalLink size={10} />
                {src.articleNumber ? `Art. ${src.articleNumber}` : src.title?.substring(0, 25)}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-secondary transition-all">
              {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
            </button>
            {onBookmark && (
              <button onClick={() => onBookmark(message._id)} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-accent-blue transition-all">
                {message.bookmarked ? <BookmarkCheck size={14} className="text-accent-blue" /> : <BookmarkPlus size={14} />}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
