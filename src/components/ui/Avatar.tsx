export interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  status?: 'online' | 'offline' | 'away'
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export default function Avatar({ src, name, size = 'md', status, className = '' }: AvatarProps) {
  const px = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.md)
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'

  const statusSize = px <= 32 ? '10px' : px >= 80 ? '18px' : '14px'
  const borderWidth = px <= 32 ? '2px' : px >= 80 ? '3px' : '3px'

  return (
    <div
      className={`relative rounded-[var(--radius-pill)] shrink-0 overflow-visible ${className}`}
      style={{ width: `${px}px`, height: `${px}px` }}
    >
      {src ? (
        <img
          src={src}
          alt={name || ''}
          className="w-full h-full rounded-[var(--radius-pill)] object-cover border-2 border-border"
        />
      ) : (
        <div className="w-full h-full rounded-[var(--radius-pill)] bg-slate-100 dark:bg-white/10 text-primary dark:text-white border border-border/50 font-bold flex items-center justify-center text-[0.85em] shadow-[var(--shadow-sm)]">
          {initials}
        </div>
      )}
      {status ? (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-[var(--radius-pill)] border-[var(--bg-card)]"
          style={{
            width: statusSize,
            height: statusSize,
            borderWidth,
            backgroundColor:
              status === 'online'
                ? 'var(--color-success)'
                : status === 'offline'
                  ? 'var(--text-disabled)'
                  : 'var(--color-warning)',
          }}
        />
      ) : null}
    </div>
  )
}
