import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Stack from '@/components/Stack'
import Grid from '@/components/Grid'
import Tabs from '@/components/Tabs'
import ModuleHeader from '@/components/ModuleHeader'
import useStore from '@/store/useStore'
import { storage } from '@/lib/storage'
import { courseData, participantsData, courseTabItems } from '@/lib/courseData'
import {
  CourseSidebar,
  CourseBreadcrumbs,
  CourseTabContent,
} from '@/components'

function Course() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const [activeTab, setActiveTab] = useState<string>('modules')
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const course = courseData[Number(id)]
    if (!course) return []
    return storage.get(`expandedSections_${id}`, course.sections.map((s) => s.id))
  })
  const [completedItems, setCompletedItems] = useState<number[]>(() => {
    return storage.get(`courseProgress_${id}`, [])
  })

  const courseIdNum = Number(id)
  const data = courseData[courseIdNum]

  useEffect(() => {
    if (!data) navigate('/courses')
  }, [id, data, navigate])

  useEffect(() => {
    storage.set(`expandedSections_${id}`, expandedSections)
  }, [expandedSections, id])

  useEffect(() => {
    storage.set(`courseProgress_${id}`, completedItems)
  }, [completedItems, id])

  const toggleItem = useCallback((itemId: number): void => {
    setCompletedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((i) => i !== itemId)
      }
      return [...prev, itemId]
    })
  }, [])

  const toggleSection = useCallback((sectionId: string): void => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((s) => s !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }, [expandedSections])



  const totalItems = useMemo(
    () => data?.sections.reduce((acc, section) => acc + section.items.length, 0) || 0,
    [data]
  )
  const progress = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0

  const tabItems = useMemo(
    () => courseTabItems.map((ti) => ({ ...ti, label: t(ti.label) })),
    [t]
  )

  if (!data) return null

  return (
    <Stack gap="none" className="container animate-fade-in">
      <CourseBreadcrumbs id={id!} t={t} />
      <ModuleHeader
        image={data.img}
        code={data.code}
        title={t(`course_${id}_title`)}
        semester={t('course_semester_spring')}
        professor={data.professor}
        campus={t('course_campus_aalborg')}
      />

      <div className="mt-xl">
        <Grid gap="xl" columns={12}>
          <Grid.Item span={8} tabletSpan={12} mobileSpan={12}>
            <div className="mb-lg">
              <Tabs
                items={tabItems}
                activeTab={activeTab}
                onChange={(val) => setActiveTab(val || 'modules')}
              />
            </div>

            <CourseTabContent
              activeTab={activeTab}
              courseId={id!}
              progress={progress}
              completedItems={completedItems}
              expandedSections={expandedSections}
              sections={data.sections}
              toggleItem={toggleItem}
              toggleSection={toggleSection}
              participantsData={participantsData}
              professor={data.professor}
            />
          </Grid.Item>

          <Grid.Item span={4} tabletSpan={12} mobileSpan={12}>
            <CourseSidebar
              courseId={id!}
              professor={data.professor}
              email={data.email}
              setActiveTab={setActiveTab}
            />
          </Grid.Item>
        </Grid>
      </div>
    </Stack>
  )
}

export default memo(Course)
