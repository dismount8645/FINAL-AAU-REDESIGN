

import userEvent from '@testing-library/user-event';
import type { LucideIcon } from 'lucide-react';
import { FileText, Settings } from 'lucide-react';
import { Stack } from '@/components/Layout/LayoutPrimitives';;

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

if (import.meta.vitest) {
  describe('TabBar', () => {
    const mockTabs = [
      { id: 'tab1', label: 'Tab 1', icon: FileText },
      { id: 'tab2', label: 'Tab 2', icon: Settings },
    ]
  
    it('renders all tab options', () => {
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={() => {}} />)
      expect(screen.getByText('Tab 1')).toBeInTheDocument()
      expect(screen.getByText('Tab 2')).toBeInTheDocument()
    })
  
    it('highlights the active tab', () => {
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={() => {}} />)
      const tab1 = screen.getByTestId('tab-tab1')
      const tab2 = screen.getByTestId('tab-tab2')
      expect(tab1).toHaveClass('text-primary')
      expect(tab2).toHaveClass('text-muted')
    })
  
    it('calls onChange when a tab is clicked', () => {
      const handleChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={handleChange} />)
      const tab2 = screen.getByTestId('tab-tab2')
      fireEvent.click(tab2)
      expect(handleChange).toHaveBeenCalledWith('tab2')
    })
  
    it('renders secondary action content when provided', () => {
      render(
        <TabBar
          tabs={mockTabs}
          activeTab="tab1"
          onChange={() => {}}
          secondaryAction={<button data-testid="secondary">Extra Button</button>}
        />
      )
      expect(screen.getByTestId('secondary')).toBeInTheDocument()
    })
  
    it('renders icons on tabs', () => {
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={() => {}} />)
      const svgs = document.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })
  
    it('shows active indicator on active tab', () => {
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={() => {}} />)
      const tab1 = screen.getByTestId('tab-tab1')
      expect(tab1.querySelector('.h-\\[3px\\]')).toBeInTheDocument()
      expect(screen.getByTestId('tab-tab2').querySelector('.h-\\[3px\\]')).not.toBeInTheDocument()
    })
  
    it('navigates right with ArrowRight key', async () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={onChange} />)
      screen.getByTestId('tab-tab1').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onChange).toHaveBeenCalledWith('tab2')
    })
  
    it('navigates left with ArrowLeft key', async () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab2" onChange={onChange} />)
      screen.getByTestId('tab-tab2').focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(onChange).toHaveBeenCalledWith('tab1')
    })
  
    it('wraps navigation at edges with ArrowRight', async () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab2" onChange={onChange} />)
      screen.getByTestId('tab-tab2').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onChange).toHaveBeenCalledWith('tab1')
    })
  
    it('wraps navigation at edges with ArrowLeft', async () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={onChange} />)
      screen.getByTestId('tab-tab1').focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(onChange).toHaveBeenCalledWith('tab2')
    })
  
    it('ignores non-arrow keys during keyboard navigation', () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={onChange} />)
      const tablist = screen.getByRole('tablist')
      fireEvent.keyDown(tablist, { key: 'Tab' })
      expect(onChange).not.toHaveBeenCalled()
    })
  
    it('sets aria-selected and tabIndex correctly', () => {
      render(<TabBar tabs={mockTabs} activeTab="tab1" onChange={() => {}} />)
      expect(screen.getByTestId('tab-tab1')).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByTestId('tab-tab1')).toHaveAttribute('tabindex', '0')
      expect(screen.getByTestId('tab-tab2')).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByTestId('tab-tab2')).toHaveAttribute('tabindex', '-1')
    })

    it('returns early if active tab index is -1', () => {
      const onChange = vi.fn()
      render(<TabBar tabs={mockTabs} activeTab="non-existent" onChange={onChange} />)
      const tablist = screen.getByRole('tablist')
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
      expect(onChange).not.toHaveBeenCalled()
    })
  })
}
