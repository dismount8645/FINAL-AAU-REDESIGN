import { useLocation } from 'react-router-dom';
import { WidgetGrid } from '@/components/Widgets/WidgetGrid';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';

const DEFAULT_WIDGETS = [
  { id: 'favorites', span: 6 },
  { id: 'quickOverview', span: 8 },
  { id: 'deadlines', span: 4 },
  { id: 'recentGrades', span: 4 },
  { id: 'forumActivity', span: 4 },
]

function Dashboard() {
  const t = useStore((state) => state.t)
  const location = useLocation()

  return (
    <PageLayout
      key={location.key}
      className="dashboard-page relative"
      pageKey="dashboard"
      title={t('common.welcome')}
      subtitle={t('common.assignments_count')}
    >
      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-[var(--space-md)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
        <WidgetGrid widgets={DEFAULT_WIDGETS} />
      </div>
    </PageLayout>
  )
}

export default Dashboard

if (import.meta.vitest) {
  describe('Dashboard Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })

    const renderDashboard = () => {
      return renderWithProviders(<Dashboard />)
    }

    it('renders correctly', () => {
      renderDashboard()
      expect(screen.getByText('Velkommen tilbage, Jacob')).toBeInTheDocument()
    })

    it('renders all widgets', () => {
      renderDashboard()
      expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
      expect(screen.getByText('Favoritter')).toBeInTheDocument()
      expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
    })
  })
}
