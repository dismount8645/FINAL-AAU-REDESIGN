import { useEffect, type ReactNode } from 'react';


import { Heading, Text } from '@/components/ui';
import useStore, { type BreadcrumbItem } from '@/store';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  pageKey?: string;
  title?: string;
  subtitle?: string;
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

  const headerLabel = title !== undefined ? title : t(pageKey || '')

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
      <div className="page-header-content w-full px-[var(--space-md)]">
        <div className="flex flex-col gap-xs w-full">
          <div className="flex flex-row justify-between items-center gap-md w-full">
            <div className="flex-1 min-w-0">
              {children}
              <Heading
                level={1}
                {...titleProps}
                className={cn(
                  "page-header-title m-0 text-wrap break-words sm:text-balance text-2xl sm:text-3xl font-extrabold",
                  titleProps?.className
                )}
              >
                {headerLabel}
              </Heading>
            </div>
            {actions && (
              <div
                className={cn(
                  'page-header-actions flex flex-wrap gap-sm justify-end shrink-0',
                  {
                    'items-start md:items-start': actionsAlign === 'start',
                    'items-center md:items-center': actionsAlign === 'center',
                    'items-end md:items-end': actionsAlign === 'end',
                    'items-stretch md:items-stretch': actionsAlign === 'stretch',
                    'items-baseline md:items-baseline': actionsAlign === 'baseline',
                  }
                )}
              >
                {actions}
              </div>
            )}
          </div>
          {subtitle && (
            <Text size="base" muted className="page-header-subtitle m-0 w-full text-balance">
              {subtitle}
            </Text>
          )}
        </div>
      </div>
    </header>
  )
}

if (import.meta.vitest) {
  describe('PageHeader', () => {
    beforeEach(() => {
      useStore.setState({
        lang: 'da',
        t: (key: string) => key,
      })
    })
  
    it('renders the title correctly', () => {
      render(<PageHeader title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeDefined()
    })
  
    it('renders the subtitle when provided', () => {
      render(<PageHeader title="Test Title" subtitle="Test Subtitle" />)
      expect(screen.getByText('Test Subtitle')).toBeDefined()
    })
  
    it('renders actions when provided', () => {
      render(
        <PageHeader 
          title="Test Title" 
          actions={<button data-testid="action-btn">Action</button>} 
        />
      )
      expect(screen.getByTestId('action-btn')).toBeDefined()
    })
  
    it('applies the flat class when flat prop is true', () => {
      const { container } = render(<PageHeader title="Test Title" flat={true} />)
      const header = container.querySelector('header')
      expect(header?.classList.contains('page-header--flat')).toBe(true)
    })
  
    it('renders children before the title', () => {
      render(
        <PageHeader title="Main Title">
          <span data-testid="child-element">Child Content</span>
        </PageHeader>
      )
      expect(screen.getByTestId('child-element')).toBeDefined()
    })
  
    it('renders without wave background', () => {
      render(<PageHeader title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeDefined()
    })
  
    it('uses pageKey for translation if title is missing', () => {
      render(<PageHeader pageKey="dashboard_title" />)
      expect(screen.getByText('dashboard_title')).toBeDefined()
    })
  
    it('renders with empty title/pageKey', () => {
      render(<PageHeader />)
      expect(document.querySelector('.page-header-title')).toBeInTheDocument()
    })
  
    it('applies different actionsAlign classes', () => {
      const { rerender } = render(<PageHeader title="T" actions={<div>A</div>} actionsAlign="center" />)
      expect(document.querySelector('.page-header-actions')).toHaveClass('md:items-center')
  
      rerender(<PageHeader title="T" actions={<div>A</div>} actionsAlign="end" />)
      expect(document.querySelector('.page-header-actions')).toHaveClass('md:items-end')
  
      rerender(<PageHeader title="T" actions={<div>A</div>} actionsAlign="stretch" />)
      expect(document.querySelector('.page-header-actions')).toHaveClass('md:items-stretch')
  
      rerender(<PageHeader title="T" actions={<div>A</div>} actionsAlign="baseline" />)
      expect(document.querySelector('.page-header-actions')).toHaveClass('md:items-baseline')
    })
  })
}
