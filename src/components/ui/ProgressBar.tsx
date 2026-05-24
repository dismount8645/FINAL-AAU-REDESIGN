import { cn } from "@/lib/utils"

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

  if (import.meta.env.DEV) {
    console.debug('ProgressBar rendered', { value: safeValue, color })
  }

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

