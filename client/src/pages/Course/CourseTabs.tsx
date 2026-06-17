import { Tabs, type TabItem } from '@/components/ui';

interface CourseTabsProps {
  tabItems: TabItem[]
  activeTab: string
  setActiveTab: (val: string) => void
}

function CourseTabs({ tabItems, activeTab, setActiveTab }: CourseTabsProps) {
  return (
    <Tabs
      items={tabItems}
      activeTab={activeTab}
      onChange={(val) => setActiveTab(val || 'modules')}
    />
  )
}

export default CourseTabs
