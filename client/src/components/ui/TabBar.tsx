
import type { LucideIcon } from 'lucide-react';
import { Stack } from '@/components/Layout/LayoutPrimitives';

interface Tab {
  id: string
  label: string
  icon?: LucideIcon
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  secondaryAction?: React.ReactNode
}

export default function TabBar({ tabs, activeTab, onChange, secondaryAction }: TabBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();

    const tabButtons = Array.from(e.currentTarget.children).filter(
      (el): el is HTMLButtonElement => el.tagName === 'BUTTON'
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
    onChange(tabs[nextIndex].id);
  };

  return (
    <Stack direction="row" justify="between" align="center" className="w-full">
      <div 
        role="tablist" 
        onKeyDown={handleKeyDown} 
        className="flex flex-row gap-none"
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              data-testid={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`relative px-md py-sm text-sm font-bold transition-all flex items-center gap-xs outline-none focus-visible:outline-none focus-visible:shadow-focus rounded-sm before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] ${
                isActive ? 'text-primary' : 'text-muted hover:text-main'
              }`}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_6px_rgba(var(--color-primary-rgb),0.3)]" />
              )}
            </button>
          );
        })}
      </div>
      {secondaryAction}
    </Stack>
  )
}
