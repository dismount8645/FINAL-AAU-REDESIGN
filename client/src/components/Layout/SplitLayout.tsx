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

function SplitLayout({
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
    <div className={cn("flex flex-col min-h-0", fullHeight ? "h-full overflow-hidden" : "h-auto overflow-visible")}>
      {listHeader && (
        <div className="sticky top-0 z-10 shrink-0 bg-bg-card border-b border-border">
          {listHeader}
        </div>
      )}
      <div className={cn("min-h-0", fullHeight ? "flex-1 overflow-y-auto custom-scrollbar" : "h-auto overflow-visible")}>
        {sidebar}
      </div>
    </div>
  )

  const detailPanel = (
    <div className={cn("flex flex-col min-h-0", fullHeight ? "h-full overflow-hidden" : "h-auto overflow-visible")}>
      {detailHeader && (
        <div className="sticky top-0 z-10 shrink-0 bg-bg-card border-b border-border">
          {detailHeader}
        </div>
      )}
      <div className={cn("min-h-0", fullHeight ? "flex-1 overflow-y-auto custom-scrollbar" : "h-auto overflow-visible")}>
        {main}
      </div>
    </div>
  )

  const containerClasses = cn(
    'animate-fade-in',
    fullHeight ? 'h-[calc(100vh-var(--topbar-height)-var(--space-2xl))] min-h-0 overflow-hidden' : 'h-auto overflow-visible',
    className
  );

  return (
    <div className={containerClasses}>
      {/* Desktop Layout - Rendered only when not on mobile to prevent DOM duplication in tests */}
      {!isMobile && (
        <div className={cn("hidden md:block", fullHeight ? "h-full" : "h-auto")}>
          <Grid columns={12} gap="lg" className={fullHeight ? "h-full" : "h-auto"}>
            {sidebarPosition === 'left' ? (
              <>
                <Grid.Item span={sidebarSpan} className={cn("min-w-0", fullHeight ? "h-full" : "h-auto")}>{listPanel}</Grid.Item>
                <Grid.Item span={mainSpan} className={cn("min-w-0", fullHeight ? "h-full" : "h-auto")}>{detailPanel}</Grid.Item>
              </>
            ) : (
              <>
                <Grid.Item span={mainSpan} className={cn("min-w-0", fullHeight ? "h-full" : "h-auto")}>{detailPanel}</Grid.Item>
                <Grid.Item span={sidebarSpan} className={cn("min-w-0", fullHeight ? "h-full" : "h-auto")}>{listPanel}</Grid.Item>
              </>
            )}
          </Grid>
        </div>
      )}

      {/* Mobile Layout - Rendered only when on mobile to prevent DOM duplication in tests */}
      {isMobile && (
        <div className={cn("md:hidden relative", fullHeight ? "h-full overflow-hidden" : "h-auto overflow-visible")}>
          <AnimatePresence initial={false} mode="wait">
            {!isDetailVisible ? (
              <motion.div
                key="sidebar-panel"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className={cn("w-full", fullHeight ? "absolute inset-0 h-full" : "relative h-auto")}
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
                className={cn("w-full", fullHeight ? "absolute inset-0 h-full" : "relative h-auto")}
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
