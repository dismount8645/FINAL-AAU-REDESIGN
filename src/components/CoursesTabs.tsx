import { memo, useMemo } from 'react'
import Tabs from '@/components/Tabs'
import useStore from '@/lib/store'

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

  const items = useMemo(() => tabItems.map((ti) => ({
    ...ti,
    label: t(ti.key === 'current' ? 'tab_current' : ti.key === 'finished' ? 'tab_finished' : 'tab_upcoming')
  })), [t])

  return (
    <Tabs
      items={items}
      activeTab={activeTab}
      onChange={(v) => setActiveTab(v as 'current' | 'finished' | 'upcoming')}
    />
  )
}

export default memo(CoursesTabs)
