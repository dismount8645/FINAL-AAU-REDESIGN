

import userEvent from '@testing-library/user-event';
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
    <div role="tablist" onKeyDown={handleKeyDown} className={cn('flex flex-nowrap overflow-x-auto no-scrollbar border-b border-border gap-0', className)}>
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
              "relative flex items-center px-md py-sm cursor-pointer transition-all duration-150 font-bold text-sm whitespace-nowrap outline-none focus-visible:outline-none focus-visible:shadow-focus focus-visible:bg-bg-hover before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
              isActive ? 'text-primary' : 'text-muted hover:text-main dark:text-white/60 dark:hover:text-white'
            )}
            onClick={() => onChange(tabId)}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span 
                className={cn(
                  'ml-sm px-2xs py-0.5 rounded-[var(--radius-pill)] text-[10px] font-black tracking-tighter uppercase transition-colors',
                  isActive ? 'bg-primary text-white' : 'bg-muted dark:bg-white/10 text-muted'
                )}
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

if (import.meta.vitest) {
  describe('Tabs', () => {
    const mockItems = [
      { id: 'tab1', label: 'First Tab', count: 5 },
      { id: 'tab2', label: 'Second Tab' },
      { id: 'tab3', label: 'Third Tab', count: 0 },
    ]
  
    it('renders all tab items', () => {
      render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} />)
      
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)
      expect(tabs[0]).toHaveTextContent('First Tab')
      expect(tabs[1]).toHaveTextContent('Second Tab')
    })
  
    it('marks active tab by text color', () => {
      render(<Tabs items={mockItems} activeTab="tab2" onChange={() => {}} />)
      
      const tabs = screen.getAllByRole('tab')
      expect(tabs[1].className).toContain('text-primary')
      expect(tabs[0].className).toContain('text-muted')
    })
  
    it('calls onChange with tab id when clicked', async () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />)
      
      const tabs = screen.getAllByRole('tab')
      await userEvent.click(tabs[1])
      expect(onChange).toHaveBeenCalledWith('tab2')
      
      await userEvent.click(tabs[2])
      expect(onChange).toHaveBeenCalledWith('tab3')
    })
  
    it('renders count badge when provided', () => {
      render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} />)
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  
    it('applies custom className', () => {
      const { container } = render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} className="custom-tabs" />)
      
      expect((container.firstChild as HTMLElement)?.className).toContain('custom-tabs')
    })
  
    it('works with key instead of id', () => {
      const itemsWithKey = [
        { key: 'key1', label: 'Key Tab 1' },
        { key: 'key2', label: 'Key Tab 2' },
      ]
      const onChange = vi.fn()
      
      render(<Tabs items={itemsWithKey} activeTab="key1" onChange={onChange} />)
      
      const tabs = screen.getAllByRole('tab')
      expect(tabs[0].className).toContain('text-primary')
    })
  
    it('sets aria-selected on active tab', () => {
      render(<Tabs items={mockItems} activeTab="tab2" onChange={() => {}} />)
      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
    })
  
    it('sets aria-controls on each tab', () => {
      render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} />)
      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-controls', 'panel-tab1')
      expect(tabs[1]).toHaveAttribute('aria-controls', 'panel-tab2')
    })
  
    it('renders tablist role on container', () => {
      const { container } = render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} />)
      expect(container.firstChild).toHaveAttribute('role', 'tablist')
    })
  
    it('renders tabs without id or key', () => {
      const itemsNoId = [
        { label: 'No ID 1' },
        { label: 'No ID 2' },
      ]
      render(<Tabs items={itemsNoId} activeTab={undefined} onChange={() => {}} />)
      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(2)
      expect(tabs[0]).not.toHaveAttribute('id')
      expect(tabs[0]).not.toHaveAttribute('aria-controls')
    })
  
    it('renders count badge with 0 value', () => {
      render(<Tabs items={mockItems} activeTab="tab3" onChange={() => {}} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  
    it('navigates right with ArrowRight key', async () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />)
      screen.getAllByRole('tab')[0].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onChange).toHaveBeenCalledWith('tab2')
    })
  
    it('navigates left with ArrowLeft key', async () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab2" onChange={onChange} />)
      screen.getAllByRole('tab')[1].focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(onChange).toHaveBeenCalledWith('tab1')
    })
  
    it('wraps navigation at edges with ArrowRight', async () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab3" onChange={onChange} />)
      screen.getAllByRole('tab')[2].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onChange).toHaveBeenCalledWith('tab1')
    })
  
    it('wraps navigation at edges with ArrowLeft', async () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />)
      screen.getAllByRole('tab')[0].focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(onChange).toHaveBeenCalledWith('tab3')
    })
  
    it('ignores non-arrow keys during keyboard navigation', () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Enter' })
      expect(onChange).not.toHaveBeenCalled()
    })
  
    it('shows active indicator bar on active tab', () => {
      render(<Tabs items={mockItems} activeTab="tab1" onChange={() => {}} />)
      const tabs = screen.getAllByRole('tab')
      const indicator = tabs[0].querySelector('.h-\\[3px\\]')
      expect(indicator).toBeInTheDocument()
      expect(tabs[1].querySelector('.h-\\[3px\\]')).not.toBeInTheDocument()
    })

    it('returns early when active index is -1', () => {
      const onChange = vi.fn()
      render(<Tabs items={mockItems} activeTab="non-existent" onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
      expect(onChange).not.toHaveBeenCalled()
    })

    it('handles items with only key and no id, and label fallbacks', () => {
      const onChange = vi.fn()
      const items = [
        { key: 'key1', label: 'Label 1' },
        { key: 'key2', label: '' },
      ]
      render(<Tabs items={items} activeTab="key1" onChange={onChange} />)
      expect(screen.getByRole('tab', { name: 'Label 1' })).toBeInTheDocument()
      fireEvent.click(screen.getAllByRole('tab')[1])
      expect(onChange).toHaveBeenCalledWith('key2')
    })
  })
}
