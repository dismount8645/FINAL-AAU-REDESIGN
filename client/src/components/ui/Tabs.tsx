import { cn } from '@/lib/utils';

export interface TabItem {
  id?: string
  key?: string
  label: string
  count?: number
}

export interface TabsProps {
  items: TabItem[]
  activeTab?: string
  onChange: (tabId: string | undefined) => void
  className?: string
}

export default function Tabs({ items, activeTab, onChange, className = '' }: TabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();

    const tabButtons = Array.from(e.currentTarget.children).filter(
      (el): el is HTMLButtonElement => el.getAttribute('role') === 'tab'
    );
    const activeIndex = tabButtons.findIndex(btn => btn.getAttribute('aria-selected') === 'true');
    
    if (activeIndex === -1) return;

    let nextIndex = activeIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % tabButtons.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + tabButtons.length) % tabButtons.length;
    }

    tabButtons[nextIndex].focus();
    const nextTabId = items[nextIndex].id || items[nextIndex].key;
    onChange(nextTabId);
  };

  return (
    <div 
      role="tablist" 
      onKeyDown={handleKeyDown} 
      className={cn('flex flex-nowrap overflow-x-auto no-scrollbar bg-bg-card border border-border/60 p-xs rounded-xl gap-xs w-fit max-w-full', className)}
    >
      {items.map((tab, i) => {
        const isActive = activeTab === (tab.id || tab.key)
        const tabId = tab.id || tab.key
        return (
          <button
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            aria-controls={tabId ? `panel-${tabId}` : undefined}
            id={tabId ? `tab-${tabId}` : undefined}
            key={tabId || tab.label || i}
            className={cn(
              "relative flex items-center px-md py-xs cursor-pointer transition-all duration-150 font-bold text-sm whitespace-nowrap outline-none focus-visible:outline-none focus-visible:shadow-focus rounded-lg",
              isActive 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-muted hover:text-main dark:text-white/60 dark:hover:text-white hover:bg-bg-hover'
            )}
            onClick={() => onChange(tabId)}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span 
                className={cn(
                  'ml-sm px-2xs py-0.5 rounded-[var(--radius-pill)] text-[10px] font-black tracking-tighter uppercase transition-colors',
                  isActive ? 'bg-white text-primary' : 'bg-muted dark:bg-white/10 text-muted'
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

