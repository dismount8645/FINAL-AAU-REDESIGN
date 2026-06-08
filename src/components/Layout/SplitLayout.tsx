import { type ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { cn } from '@/lib/utils';

interface SplitLayoutProps {
  main: ReactNode
  sidebar: ReactNode
  className?: string
  mainSpan?: number
  sidebarSpan?: number
  listHeader?: ReactNode
  detailHeader?: ReactNode
  sidebarPosition?: 'left' | 'right'
  /** Mobile-only: whether to show the detail panel instead of the list */
  showDetailOnMobile?: boolean
  /** If true, the layout will fill the remaining viewport height and scroll internally */
  fullHeight?: boolean
}

export function SplitLayout({
  main,
  sidebar,
  className = '',
  mainSpan = 8,
  sidebarSpan = 4,
  listHeader,
  detailHeader,
  sidebarPosition = 'right',
  showDetailOnMobile,
  fullHeight = true,
}: SplitLayoutProps) {
  // Logic for mobile view toggling
  // Default: if sidebar is on left (list), show sidebar first. If on right (extra info), show main first.
  const isDetailVisible = showDetailOnMobile ?? (sidebarPosition === 'right');

  // We use JS-based breakpoint detection to avoid duplicate DOM trees in test environments (JSDOM)
  // while still relying on CSS for the actual responsive layout in browsers.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mql.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const listPanel = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {listHeader && (
        <div className="sticky top-0 z-10 shrink-0 bg-bg-card border-b border-border">
          {listHeader}
        </div>
      )}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {sidebar}
      </div>
    </div>
  )

  const detailPanel = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {detailHeader && (
        <div className="sticky top-0 z-10 shrink-0 bg-bg-card border-b border-border">
          {detailHeader}
        </div>
      )}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {main}
      </div>
    </div>
  )

  const containerClasses = cn(
    'animate-fade-in',
    fullHeight && 'h-[calc(100vh-var(--topbar-height)-var(--space-2xl))] min-h-0 overflow-hidden',
    className
  );

  return (
    <div className={containerClasses}>
      {/* Desktop Layout - Rendered only when not on mobile to prevent DOM duplication in tests */}
      {!isMobile && (
        <div className="hidden md:block h-full">
          <Grid columns={12} gap="lg" className="h-full">
            {sidebarPosition === 'left' ? (
              <>
                <Grid.Item span={sidebarSpan} className="min-w-0 h-full">{listPanel}</Grid.Item>
                <Grid.Item span={mainSpan} className="min-w-0 h-full">{detailPanel}</Grid.Item>
              </>
            ) : (
              <>
                <Grid.Item span={mainSpan} className="min-w-0 h-full">{detailPanel}</Grid.Item>
                <Grid.Item span={sidebarSpan} className="min-w-0 h-full">{listPanel}</Grid.Item>
              </>
            )}
          </Grid>
        </div>
      )}

      {/* Mobile Layout - Rendered only when on mobile to prevent DOM duplication in tests */}
      {isMobile && (
        <div className="md:hidden h-full overflow-hidden relative">
          <AnimatePresence initial={false} mode="wait">
            {!isDetailVisible ? (
              <motion.div
                key="sidebar-panel"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="absolute inset-0 h-full w-full"
              >
                {listPanel}
              </motion.div>
            ) : (
              <motion.div
                key="main-panel"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="absolute inset-0 h-full w-full"
              >
                {detailPanel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default SplitLayout
