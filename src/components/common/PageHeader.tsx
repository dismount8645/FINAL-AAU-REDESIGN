import { useEffect, type ReactNode } from 'react'
import WavesBackground from '@/components/common/WavesBackground'
import { Heading, Text } from '@/components/ui/Typography'
import Stack from '@/components/ui/Stack'
import useStore, { type BreadcrumbItem } from '@/store/useStore'
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
}

export default function PageHeader({ pageKey, title, subtitle, wave = false, flat = false, actions, actionsAlign = 'start', breadcrumbs, children, className }: PageHeaderProps) {
  const { t, setBreadcrumbs } = useStore()

  const breadcrumbsStr = JSON.stringify(breadcrumbs)

  useEffect(() => {
    setBreadcrumbs(breadcrumbsStr ? JSON.parse(breadcrumbsStr) : undefined)
    return () => {
      setBreadcrumbs(undefined)
    }
  }, [breadcrumbsStr, setBreadcrumbs])

  return (
    <>
      <header className={cn(`page-header on-dark relative overflow-hidden box-border w-full max-w-full min-w-0 ${flat ? 'page-header--flat' : 'page-header--card'}`, className)}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {wave ? <WavesBackground page={pageKey || title?.toLowerCase()} /> : null}
        <div className="page-header-content w-full px-[var(--space-md)]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-md md:gap-xl w-full">
            <Stack gap="xs" className="flex-1 min-w-0">
              {children}
              <Heading level={1} className="page-header-title m-0 text-wrap break-words sm:text-balance text-2xl sm:text-3xl font-bold">{title || t(pageKey || '')}</Heading>
              {subtitle ? <Text size="base" muted className="page-header-subtitle m-0">{subtitle}</Text> : null}
            </Stack>
            {actions && (
              <div className={cn(
                "page-header-actions flex flex-wrap gap-sm w-full md:w-auto md:justify-end",
                actionsAlign === 'start' && "md:items-start",
                actionsAlign === 'center' && "md:items-center",
                actionsAlign === 'end' && "md:items-end",
                actionsAlign === 'stretch' && "md:items-stretch",
                actionsAlign === 'baseline' && "md:items-baseline"
              )}>
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
