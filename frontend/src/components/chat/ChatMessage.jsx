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
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-8 w-full`}
    >
      {/* Avatar */}
      <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center mt-1 border border-surface-border bg-bg-primary">
        {isUser ? <User size={12} className="text-text-muted" /> : <ShieldCheck size={12} className="text-text-primary" />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`text-[14px] leading-relaxed text-text-primary ${isUser ? 'pt-1' : 'pt-1'}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-text-primary prose-headings:font-medium prose-strong:text-text-primary prose-strong:font-medium prose-code:text-text-primary prose-code:bg-surface/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-ul:my-2 prose-li:my-1 text-text-secondary">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.sources.filter(s => s.title).slice(0, 3).map((src, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-surface/30 border border-surface-border text-text-muted rounded hover:text-text-primary transition-colors cursor-pointer">
                <ExternalLink size={8} />
                {src.articleNumber ? `Art. ${src.articleNumber}` : src.title?.substring(0, 20)}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
            {onBookmark && (
              <button onClick={() => onBookmark(message._id)} className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
                {message.bookmarked ? <BookmarkCheck size={12} /> : <BookmarkPlus size={12} />}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
