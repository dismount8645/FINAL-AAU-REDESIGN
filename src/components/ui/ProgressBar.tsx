export interface ProgressBarProps {
  value?: number
  color?: string
  height?: number
  showLabel?: boolean | string
}

export default function ProgressBar({ value, color, height = 6, showLabel }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-sm">
      <div className="w-full rounded-pill overflow-hidden" style={{ height, backgroundColor: 'var(--bg-placeholder)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(Math.max(value!, 0), 100)}%`, background: color || 'var(--color-primary)' }}
        />
      </div>
      {showLabel ? <span className="text-xs">{showLabel === true ? `${value}%` : showLabel}</span> : null}
    </div>
  )
}
