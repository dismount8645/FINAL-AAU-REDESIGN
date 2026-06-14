

import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  /** Værdi mellem 0 og 100 */
  value?: number
  /** Farve på fremdriftslinjen – kan være CSS‑variabel eller hex */
  color?: string
  /** Højde i pixel (standard 6) */
  height?: number
  /** Visuel label – true viser procent, string viser custom tekst */
  showLabel?: boolean | string
  /** Tilgængelighed: beskrivende label for skærmlæsere */
  "aria-label"?: string
  /** Ekstra styling */
  className?: string
}

/**
 * ProgressBar med fuld ARIA‑support og token‑baseret styling.
 * - `role="progressbar"` med `aria-valuemin`, `aria-valuemax` og `aria-valuenow`.
 * - `aria-label` kan angives for ekstra kontekst.
 * - Simpel telemetry ved ændring af værdi (kun i dev‑mode).
 */
export default function ProgressBar({
  value = 0,
  color,
  height = 6,
  showLabel,
  "aria-label": ariaLabel,
  className,
}: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div
      className={cn("flex items-center gap-sm", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      aria-label={ariaLabel}
    >
      <div
        className="w-full rounded-pill overflow-hidden"
        style={{ height, backgroundColor: 'var(--color-bg-placeholder)' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${safeValue}%`,
            background: color || 'var(--color-primary)',
          }}
        />
      </div>
      {showLabel ? (
        <span className="text-xs">
          {showLabel === true ? `${safeValue}%` : showLabel}
        </span>
      ) : null}
    </div>
  )
}

if (import.meta.vitest) {
  describe('ProgressBar', () => {
    it('renders correctly', () => {
      const { container } = render(<ProgressBar value={50} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  
    it('applies correct width based on value', () => {
      const { container } = render(<ProgressBar value={50} />)
      const track = container.querySelector('.rounded-pill')
      const fill = track?.querySelector('div')
      expect(fill?.style.width).toBe('50%')
    })
  
    it('clamps value to min 0 and max 100', () => {
      const { container, rerender } = render(<ProgressBar value={-10} />)
      const track = container.querySelector('.rounded-pill')
      const fill = track?.querySelector('div')
      expect(fill?.style.width).toBe('0%')
      
      rerender(<ProgressBar value={150} />)
      const track2 = container.querySelector('.rounded-pill')
      const fill2 = track2?.querySelector('div')
      expect(fill2?.style.width).toBe('100%')
    })
  
    it('applies custom color when provided', () => {
      const { container } = render(<ProgressBar value={50} color="red" />)
      const track = container.querySelector('.rounded-pill')
      const fill = track?.querySelector('div')
      expect(fill?.style.background).toBe('red')
    })
  
    it('applies custom height when provided', () => {
      const { container } = render(<ProgressBar value={50} height={12} />)
      const track = container.querySelector('.rounded-pill') as HTMLElement
      expect(track?.style.height).toBe('12px')
    })
  
    it('uses default height of 6 when not provided', () => {
      const { container } = render(<ProgressBar value={50} />)
      const track = container.querySelector('.rounded-pill') as HTMLElement
      expect(track?.style.height).toBe('6px')
    })
  
    it('shows label with percentage when showLabel is true', () => {
      render(<ProgressBar value={75} showLabel />)
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  
    it('shows custom label string when showLabel is a string', () => {
      render(<ProgressBar value={75} showLabel="Custom Label" />)
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })
  })
}
