import { memo } from 'react'
import Tabs from '@/components/ui/Tabs'
import useStore from '@/store/useStore'

const tabItems = [
  { key: 'current', labelDa: 'I gang', labelEn: 'Current' },
  { key: 'finished', labelDa: 'Afsluttede', labelEn: 'Completed' },
  { key: 'upcoming', labelDa: 'Kommende', labelEn: 'Upcoming' },
]

interface CoursesTabsProps {
  activeTab: 'current' | 'finished' | 'upcoming'
  setActiveTab: (val: 'current' | 'finished' | 'upcoming') => void
}

function CoursesTabs({ activeTab, setActiveTab }: CoursesTabsProps) {
  const t = useStore((state) => state.t)

  return (
    <Tabs
      items={tabItems.map((ti) => ({
        ...ti,
        label: t(ti.key === 'current' ? 'tab_current' : ti.key === 'finished' ? 'tab_finished' : 'tab_upcoming')
      }))}
      activeTab={activeTab}
      onChange={(v) => setActiveTab(v as 'current' | 'finished' | 'upcoming')}
    />
  )
}

export default memo(CoursesTabs)
