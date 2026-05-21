import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Tabs from '@/components/ui/Tabs'

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
})
