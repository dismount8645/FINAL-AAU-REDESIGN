import { Grid } from '@/components/Layout/LayoutPrimitives';
import QuickOverviewWidget from './QuickOverviewWidget'
import ForumActivityWidget from './ForumActivityWidget'
import { DeadlinesWidget, FavoritesWidget, RecentGradesWidget } from './DashboardWidgets'

interface WidgetItem {
  id: string
  span: number
}

interface WidgetGridProps {
  widgets: WidgetItem[]
}

export function WidgetGrid({ widgets }: WidgetGridProps) {
  return (
    <Grid columns={24} className="dashboard__grid relative" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
      {widgets.map((widget) => {
        switch (widget.id) {
          case 'deadlines':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <DeadlinesWidget />
              </Grid.Item>
            )
          case 'favorites':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <FavoritesWidget />
              </Grid.Item>
            )
          case 'recentGrades':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <RecentGradesWidget />
              </Grid.Item>
            )
          case 'quickOverview':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <QuickOverviewWidget />
              </Grid.Item>
            )
          case 'forumActivity':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <ForumActivityWidget />
              </Grid.Item>
            )
          default:
            return null
        }
      })}
    </Grid>
  )
}

if (import.meta.vitest) {
  describe('WidgetGrid', () => {
    it('renders widgets', () => {
      const widgets = [
        { id: 'deadlines', span: 8 },
        { id: 'favorites', span: 8 },
        { id: 'recentGrades', span: 8 },
      ]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('.dashboard__grid')).toBeInTheDocument()
    })
    it('handles unknown widget type gracefully', () => {
      const widgets = [{ id: 'nonexistent', span: 12 }]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('.dashboard__grid')).toBeInTheDocument()
    })
  })
}
