import type { LucideIcon } from 'lucide-react'
import Stack from '@/components/ui/Stack'

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
  return (
    <Stack direction="row" justify="between" align="center" className="w-full">
      <Stack direction="row" gap="none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative px-md py-sm text-sm font-bold transition-all flex items-center gap-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-sm ${
              activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-main'
            }`}
          >
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_6px_rgba(var(--color-primary-rgb),0.3)]" />
            )}
          </button>
        ))}
      </Stack>
      {secondaryAction}
    </Stack>
  )
}
