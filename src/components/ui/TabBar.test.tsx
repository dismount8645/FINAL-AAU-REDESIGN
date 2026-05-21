import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TabBar from './TabBar'
import { FileText, Settings } from 'lucide-react'

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
})
