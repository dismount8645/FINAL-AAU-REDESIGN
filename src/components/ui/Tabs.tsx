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
  return (
    <div role="tablist" className={`flex flex-nowrap overflow-x-auto no-scrollbar border-b border-border gap-0 ${className}`}>
      {items.map((tab, i) => {
        const isActive = activeTab === (tab.id || tab.key)
        const tabId = tab.id || tab.key
        return (
          <button
            role="tab"
            aria-selected={isActive}
            aria-controls={tabId ? `panel-${tabId}` : undefined}
            id={tabId ? `tab-${tabId}` : undefined}
            key={tabId || tab.label || i}
            className={`relative flex items-center px-md py-sm cursor-pointer transition-all duration-200 font-bold text-sm whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset focus-visible:bg-bg-hover ${isActive ? 'text-primary' : 'text-muted hover:text-main dark:text-white/60 dark:hover:text-white'}`}
            onClick={() => onChange(tabId)}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span 
                className={`ml-sm px-2xs py-0.5 rounded-[var(--radius-pill)] text-[10px] font-black tracking-tighter uppercase transition-colors ${isActive ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/10 text-muted'}`}
              >
                {tab.count}
              </span>
            ) : null}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--color-primary-rgb),0.3)] animate-fade-in" />
            )}
          </button>
        )
      })}
    </div>
  )
}
