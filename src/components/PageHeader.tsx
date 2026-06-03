import { useEffect, type ReactNode } from 'react'
import WavesBackground from '@/components/WavesBackground'
import { Heading, Text } from '@/components/Typography'
import Stack from '@/components/Stack'
import useStore, { type BreadcrumbItem } from '@/lib/store'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  pageKey?: string;
  title?: string;
  subtitle?: string;
  wave?: boolean;
  flat?: boolean;
  actions?: ReactNode;
  actionsAlign?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  className?: string;
  titleProps?: React.HTMLAttributes<HTMLHeadingElement> & { 'data-testid'?: string };
}

/**
 * PageHeader – semantisk <header> med ARIA‑rolle og token‑baseret styling.
 * - Rolle `banner` giver screen‑readere kontekst.
 * - `aria-label` beskriver siden (fallback til title eller pageKey).
 * - Alt layout er styret af design‑tokens (var(--space-*) osv.).
 */
export default function PageHeader({
  pageKey,
  title,
  subtitle,
  wave = false,
  flat = false,
  actions,
  actionsAlign = 'start',
  breadcrumbs,
  children,
  className,
  titleProps,
}: PageHeaderProps) {
  const t = useStore(state => state.t)
  const setBreadcrumbs = useStore(state => state.setBreadcrumbs)

  const breadcrumbsStr = JSON.stringify(breadcrumbs)

  useEffect(() => {
    setBreadcrumbs(breadcrumbsStr ? JSON.parse(breadcrumbsStr) : undefined)
    return () => {
      setBreadcrumbs(undefined)
    }
  }, [breadcrumbsStr, setBreadcrumbs])

  const headerLabel = title || t(pageKey || '')

  return (
    <header
      role="banner"
      aria-label={headerLabel}
      className={cn(
        `page-header on-dark relative overflow-hidden box-border w-full max-w-full min-w-0 ${
          flat ? 'page-header--flat' : 'page-header--card'
        }`,
        className
      )}
    >
      {/* Subtil baggrundsmønster – token‑baseret opacity */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      {wave && <WavesBackground page={pageKey || title?.toLowerCase()} />}
      <div className="page-header-content w-full px-[var(--space-md)]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-md md:gap-xl w-full">
          <Stack gap="xs" className="flex-1 min-w-0">
            {children}
            <Heading
              level={1}
              {...titleProps}
              className={cn(
                "page-header-title m-0 text-wrap break-words sm:text-balance text-2xl sm:text-3xl font-bold",
                titleProps?.className
              )}
            >
              {headerLabel}
            </Heading>
            {subtitle && (
              <Text size="base" muted className="page-header-subtitle m-0">
                {subtitle}
              </Text>
            )}
          </Stack>
          {actions && (
            <div
              className={cn(
                'page-header-actions flex flex-wrap gap-sm w-full md:w-auto md:justify-end',
                {
                  'md:items-start': actionsAlign === 'start',
                  'md:items-center': actionsAlign === 'center',
                  'md:items-end': actionsAlign === 'end',
                  'md:items-stretch': actionsAlign === 'stretch',
                  'md:items-baseline': actionsAlign === 'baseline',
                }
              )}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
