import type { MouseEventHandler } from 'react'
import Badge from '@/components/ui/Badge'

export interface FeedbackCardProps {
  author?: string
  authorLabel?: string
  avatar?: string
  time?: string
  content?: string
  title?: string
  replies?: number
  important?: boolean
  importantLabel?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}

export default function FeedbackCard({
  author,
  authorLabel,
  avatar,
  time,
  content,
  title,
  replies,
  important,
  importantLabel,
  onClick,
  className = '',
}: FeedbackCardProps) {
  return (
    <div className={`p-md rounded-[var(--radius-md)] bg-card border-l-[3px] border-l-primary shadow-[var(--shadow-sm)] ${className}`} onClick={onClick}>
      <div className="flex flex-col">
        {important ? <Badge variant="warning" className="mb-sm">{importantLabel || 'Important'}</Badge> : null}
        {title ? <h4 className="font-semibold mb-sm">{title}</h4> : null}
        <div className="flex items-center gap-sm mb-md">
          {avatar ? <img src={avatar} alt={author} className="w-8 h-8 rounded-pill" /> : null}
          <span className="font-semibold">{author}</span>
          {authorLabel ? <span className="text-xs text-muted">{authorLabel}</span> : null}
        </div>
        {content ? <p className="text-muted">{content}</p> : null}
      </div>
      <div className="flex justify-between mt-md">
        {replies !== undefined ? <div>
            <span className="font-bold">{replies}</span>
            <span className="text-sm text-muted ml-xs">{replies === 1 ? 'Reply' : 'Replies'}</span>
          </div> : null}
        <span className="text-sm text-muted">{time}</span>
      </div>
    </div>
  )
}
