import { useLocation, useNavigate } from 'react-router-dom';
import { WidgetGrid } from '@/components/Widgets/WidgetGrid';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import Button from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { PATHS } from '@/routes';

const DEFAULT_WIDGETS = [
  { id: 'deadlines', span: 8 },
  { id: 'quickOverview', span: 8 },
  { id: 'favorites', span: 8 },
  { id: 'forumActivity', span: 24 },
  { id: 'recentGrades', span: 12 },
  { id: 'support', span: 12 },
]

function Dashboard() {
  const t = useStore((state) => state.t)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <PageLayout
      key={location.key}
      className="dashboard-page relative"
      pageKey="dashboard"
      title={t('common.welcome')}
      subtitle={t('common.assignments_count')}
      gap="sm"
      actions={
        <Button variant="primary" onClick={() => navigate(PATHS.COURSES)} iconRight={ChevronRight}>
          {t('common.see_assignments')}
        </Button>
      }
    >
      <div className="w-full px-[var(--space-sm)] md:px-[var(--space-md)] pt-[var(--space-sm)] pb-[var(--space-2xl)]">
        <WidgetGrid widgets={DEFAULT_WIDGETS} />
      </div>
    </PageLayout>
  )
}

export default Dashboard
