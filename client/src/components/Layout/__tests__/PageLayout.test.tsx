import { renderWithProviders } from '@/test/test-utils'
import PageLayout from '../PageLayout'

describe('PageLayout', () => {
  it('renders header title and main content children', () => {
    renderWithProviders(
      <PageLayout title="Layout Title" pageKey="test">
        <div data-testid="layout-content">Main Content</div>
      </PageLayout>
    )
    expect(screen.getByText('Layout Title')).toBeDefined()
    expect(screen.getByTestId('layout-content')).toBeDefined()
  })
})
