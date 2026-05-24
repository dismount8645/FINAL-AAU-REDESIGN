import { useState, useEffect, Fragment, useCallback, memo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Tabs from '@/components/ui/Tabs'
import Stack from '@/components/ui/Stack'
import Grid from '@/components/ui/Grid'
import ModuleHeader from '@/components/ui/ModuleHeader'
import { ForumWidget } from '@/widgets'
import useStore from '@/store/useStore'
import { storage } from '@/utils/storage'
import type { CourseItem } from '@/types'
import {
  CourseModules,
  CourseResources,
  CourseInfo,
  CourseParticipants,
  CoursePbl,
  CourseSidebar,
} from './course/index'

const courseData = {
  1: {
    title: 'Digital Design og Kommunikation',
    titleEn: 'Digital Design and Communication',
    code: 'DD101',
    professor: 'Morten Jensen',
    email: 'mj@create.aau.dk',
    img: '/assets/img/grafik/billeder/Undervisning/_2WB0207.jpg',
    sections: [
      {
        id: 's1',
        title: 'Uge 1: Introduktion til Digital Design',
        titleEn: 'Week 1: Introduction to Digital Design',
        items: [
          { id: 101, type: 'pdf', title: 'Kursusbeskrivelse og pensum', titleEn: 'Course Description and Syllabus', size: '1.2 MB' },
          { id: 102, type: 'video', title: 'Velkomstvideo fra underviser', titleEn: 'Welcome Video from Instructor', duration: '5:30' },
          { id: 103, type: 'link', title: 'Link til ekstern læringsressource', titleEn: 'Link to external learning resource' },
        ],
      },
      {
        id: 's2',
        title: 'Uge 2: Brugercentreret Design',
        titleEn: 'Week 2: User-Centered Design',
        items: [
          { id: 104, type: 'pdf', title: 'Slides: Designprocesser', titleEn: 'Slides: Design Processes', size: '4.5 MB' },
          { id: 105, type: 'assignment', title: 'Aflevering: Designskitse', titleEn: 'Assignment: Design Sketch', deadline: 'Fredag kl. 12:00' },
        ],
      },
    ],
  },
  2: {
    title: 'Webudvikling og CMS',
    titleEn: 'Web Development and CMS',
    code: 'WEB202',
    professor: 'Lise Sørensen',
    email: 'ls@create.aau.dk',
    img: '/assets/img/grafik/billeder/Forskning/_DSC0400.jpg',
    sections: [
      {
        id: 'w1',
        title: 'Modul 1: HTML & CSS Fundamentals',
        titleEn: 'Module 1: HTML & CSS Fundamentals',
        items: [
          { id: 201, type: 'pdf', title: 'Guide: Semantisk HTML', titleEn: 'Guide: Semantic HTML', size: '0.8 MB' },
          { id: 202, type: 'video', title: 'CSS Flexbox & Grid Masterclass', titleEn: 'CSS Flexbox & Grid Masterclass', duration: '45:00' },
        ],
      },
      {
        id: 'w2',
        title: 'Modul 2: React & State Management',
        titleEn: 'Module 2: React & State Management',
        items: [
          { id: 203, type: 'link', title: 'React Documentation (Official)', titleEn: 'React Documentation (Official)' },
          { id: 204, type: 'assignment', title: 'Projekt: Byg en To-Do App', titleEn: 'Project: Build a To-Do App', deadline: 'Mandag kl. 09:00' },
        ],
      },
    ],
  },
  3: {
    title: 'Videnskabsteori',
    titleEn: 'Philosophy of Science',
    code: 'VT303',
    professor: 'Anders Nielsen',
    email: 'an@hum.aau.dk',
    img: '/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.jpg',
    sections: [
      {
        id: 'v1',
        title: 'Introduktion til Videnskabsteori',
        titleEn: 'Introduction to Philosophy of Science',
        items: [
          { id: 301, type: 'pdf', title: 'Kuhn: Videnskabelige revolutioner', titleEn: 'Kuhn: Scientific Revolutions', size: '3.2 MB' },
          { id: 302, type: 'pdf', title: 'Popper: Falsifikationisme', titleEn: 'Popper: Falsificationism', size: '2.8 MB' },
        ],
      },
      {
        id: 'v2',
        title: 'Videnskabelige Metoder',
        titleEn: 'Scientific Methods',
        items: [
          { id: 303, type: 'video', title: 'Forelæsning: Kvalitativ vs Kvantitativ', titleEn: 'Lecture: Qualitative vs Quantitative', duration: '1:15:00' },
        ],
      },
    ],
  },
}

const typedCourseData = courseData as unknown as Record<number, Omit<typeof courseData[1], 'sections'> & { sections: { id: string; title: string; titleEn: string; items: CourseItem[] }[] }>

const courseTabItems = [
  { key: 'modules', label: 'tab_modules' },
  { key: 'forum', label: 'tab_forums' },
  { key: 'resources', label: 'tab_resources' },
  { key: 'info', label: 'tab_info' },
  { key: 'participants', label: 'tab_participants' },
  { key: 'pbl', label: 'tab_pbl_group' },
]

const participantsData = [
  { name: 'Mette Jensen', role: 'student' },
  { name: 'Anders Nielsen', role: 'student' },
  { name: 'Sofie Pedersen', role: 'student' },
  { name: 'Emil Hansen', role: 'student' },
  { name: 'Laura Madsen', role: 'student' },
  { name: 'Oliver Christensen', role: 'student' },
  { name: 'Emma Rasmussen', role: 'student' },
  { name: 'Morten Jensen', role: 'teacher' },
]

function Course() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const [activeTab, setActiveTab] = useState<string>('modules')
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const course = typedCourseData[Number(id)]
    /* istanbul ignore next */
    if (!course) return []
    return storage.get(`expandedSections_${id}`, course.sections.map((s) => s.id))
  })
  const [completedItems, setCompletedItems] = useState<number[]>(() => {
    return storage.get(`courseProgress_${id}`, [])
  })
  const [participantSearch, setParticipantSearch] = useState('')
  const [participantRoleFilter, setParticipantRoleFilter] = useState('all')

  const courseIdNum = Number(id)
  const data = typedCourseData[courseIdNum]

  useEffect(() => {
    /* istanbul ignore next */
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

  if (!data) return null

  const totalItems = data.sections.reduce((acc, section) => acc + section.items.length, 0)
  const progress = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0

  return (
    <Stack gap="none" className="container animate-fade-in">
      <nav className="flex items-center flex-wrap gap-3xs text-sm text-muted mb-md">
        <Fragment>
          <Link to="/" className="hover:text-primary hover:underline transition-colors">{t('dashboard')}</Link>
          <ChevronRight size={14} strokeWidth={2} className="shrink-0" />
          <Link to="/courses" className="hover:text-primary hover:underline transition-colors">{t('courses')}</Link>
          <ChevronRight size={14} strokeWidth={2} className="shrink-0" />
          <span className="text-main truncate max-w-[200px] sm:max-w-none">{t(`course_${id}_title`)}</span>
        </Fragment>
      </nav>
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
                items={courseTabItems.map((ti) => ({ ...ti, label: t(ti.label) }))}
                activeTab={activeTab}
                onChange={(val) => setActiveTab(/* istanbul ignore next */ val || 'modules')}
              />
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'modules' && (
                <CourseModules
                  courseId={id!}
                  progress={progress}
                  completedItems={completedItems}
                  expandedSections={expandedSections}
                  sections={data.sections}
                  toggleItem={toggleItem}
                  toggleSection={toggleSection}
                />
              )}

              {activeTab === 'forum' && (
                <div className="animate-fade-in">
                  <ForumWidget professor={data.professor} span={8} isEditing={false} />
                </div>
              )}

              {activeTab === 'resources' && (
                <CourseResources />
              )}

              {activeTab === 'info' && (
                <CourseInfo />
              )}

              {activeTab === 'participants' && (
                <CourseParticipants
                  participantSearch={participantSearch}
                  setParticipantSearch={setParticipantSearch}
                  participantRoleFilter={participantRoleFilter}
                  setParticipantRoleFilter={setParticipantRoleFilter}
                  participantsData={participantsData}
                />
              )}

              {activeTab === 'pbl' && (
                <CoursePbl />
              )}
            </div>
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
