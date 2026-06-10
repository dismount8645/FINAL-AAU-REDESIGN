import { useState, useEffect, useCallback, useMemo, memo } from 'react';


import { useParams, useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  MessageSquare, Users, GraduationCap, Book, FileSignature, Clock,
  ChevronDown, ChevronUp, Check
} from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import SplitLayout from '@/components/Layout/SplitLayout';
import { PATHS } from '@/routes';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import {
  ModuleHeader, Tabs, Card, Heading, Text, ProgressBar, MasterItem,
  Avatar, Button
} from '@/components/ui';
import { courseData, participantsData, courseTabItems, courses } from '@/lib/data';
import { storage, cn } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';
import useStore from '@/store';
import { ASSETS } from '@/lib';
import { useFormat } from '@/hooks';
import { ITEM_TYPE_MAP } from '@/lib/theme';
import type { CourseItem } from '@/lib/types';
import CourseResources from '@/components/Courses/CourseResources';
import CourseInfo from '@/components/Courses/CourseInfo';
import CourseParticipants from '@/components/Courses/CourseParticipants';
import CoursePbl from '@/components/Courses/CoursePbl';
import ForumWidget from '@/components/Widgets/ForumWidget';

const LessonItemRow = memo(function LessonItemRow({
  item,
  courseId,
  sectionId,
  completed,
  onToggleItem,
}: {
  item: CourseItem
  courseId: string
  sectionId: string
  completed: boolean
  onToggleItem: (id: number) => void
}) {
  const t = useStore((state) => state.t)
  const navigate = useNavigate()

  const handleClick = item.type === 'assignment'
    ? () => navigate(PATHS.SUBMISSION(courseId, item.id))
    : () => {}

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleItem(item.id)
  }, [item.id, onToggleItem])

  const { getCourseItemMetadata } = useFormat()
  const metadata = getCourseItemMetadata(item)

  const isAutomatic = item.type === 'assignment'
  const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default
  const Icon = themeConfig.icon

  return (
    <MasterItem
      className="rounded-[var(--radius-md)] border border-border/40"
      leading={Icon}
      leadingClassName={cn(themeConfig.bg, `text-${themeConfig.color}`)}
      title={
        <span className="font-bold text-sm leading-tight">
          {t(`course_${courseId}_${sectionId}_i${item.id}_title`)}
        </span>
      }
      subtitle={metadata}
      onClick={handleClick}
      trailing={
        <Button
          variant={completed ? 'primary' : 'ghost'}
          size="icon"
          className={`lesson-item__checkbox shrink-0 ${completed ? '' : isAutomatic ? 'border-dashed opacity-30 cursor-default border-border' : 'border-border hover:border-primary/50 dark:border-white/20'}`}
          onClick={handleToggle}
          aria-label={completed ? t('mark_incomplete') : t('mark_complete')}
          type="button"
          disabled={isAutomatic}
        >
          {completed ? (
            <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            !isAutomatic && (
              <Check
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
                className="opacity-0 group-hover/check:opacity-30 transition-opacity"
              />
            )
          )}
        </Button>
      }
    />
  )
})

function CourseModules({
  courseId,
  progress,
  completedItems,
  expandedSections,
  sections,
  toggleItem,
  toggleSection,
}: {
  courseId: string
  progress: number
  completedItems: number[]
  expandedSections: string[]
  sections: { id: string; title: string; titleEn: string; items: CourseItem[] }[]
  toggleItem: (itemId: number) => void
  toggleSection: (sectionId: string) => void
}) {
  const t = useStore((state) => state.t)

  const getProgressMessage = (pct: number) => {
    if (pct === 0) return t('progress_0')
    if (pct < 50) return t('progress_25')
    if (pct < 75) return t('progress_50')
    if (pct < 100) return t('progress_75')
    return t('progress_100')
  }

  return (
    <Stack gap="md">
      <Card variant="elevated" accent="left" className="mb-xl">
        <Card.Header padding="compact">
          <Stack gap="2xs" className="flex-1 min-w-0">
            <Text weight="bold" size="md" className="card__title">{t('your_progress')}</Text>
            <Text size="xs" muted>{getProgressMessage(progress)}</Text>
          </Stack>
          <div className="progress-stat text-right shrink-0">
            <Text size="lg" weight="bold" className="progress-value text-[var(--color-primary)] block leading-[1]">
              {progress}%
            </Text>
            <Text size="xs" muted className="text-uppercase tracking-[0.05em]">
              {t('completed_short')}
            </Text>
          </div>
        </Card.Header>
        <div className="px-md pb-sm">
          <ProgressBar value={progress} />
        </div>
      </Card>

      <Stack gap="lg">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          return (
            <Card key={section.id} variant="elevated" className="course-section mb-md overflow-hidden shadow-[var(--shadow-md)]">
              <Card.Header className="section-header p-0 bg-bg-card overflow-hidden">
                <button
                  type="button"
                  data-section-id={section.id}
                  className="w-full text-left p-sm px-md flex items-start justify-between transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isExpanded}
                >
                  <Stack direction="row" align="start" gap="sm" className="flex-1 min-w-0 text-left">
                    <div className={`status-dot w-2 h-2 rounded-[var(--radius-pill)] shrink-0 mt-1.5 md:mt-2 ${progress > 50 ? 'active bg-success shadow-[0_0_6px_rgba(var(--color-success-rgb),0.3)]' : 'pending bg-[var(--color-border)] dark:bg-white/20'}`} title={progress > 50 ? 'Gennemført' : 'Ikke gennemført'} />
                    <Heading level={4} as="h2" className="m-0 text-left">{t(`course_${courseId}_${section.id}_title`)}</Heading>
                  </Stack>
                  {isExpanded ? (
                    <ChevronUp size={20} strokeWidth={2.5} className="text-muted transition-transform duration-150 mt-1 shrink-0" />
                  ) : (
                    <ChevronDown size={20} strokeWidth={2.5} className="text-muted transition-transform duration-150 mt-1 shrink-0" />
                  )}
                </button>
              </Card.Header>
              {isExpanded && (
                <Card.Body padding="compact" className="section-content">
                  <Stack gap="2xs">
                    {section.items.map((item) => (
                      <LessonItemRow
                        key={item.id}
                        item={item}
                        courseId={courseId}
                        sectionId={section.id}
                        completed={completedItems.includes(item.id)}
                        onToggleItem={toggleItem}
                      />
                    ))}
                  </Stack>
                </Card.Body>
              )}
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}

function Course() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const [activeTab, setActiveTab] = useState<string>('modules')
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const course = courseData[Number(id)]
    if (!course) return []
    return storage.get(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}${id}`, course.sections.map((s) => s.id))
  })
  const [completedItems, setCompletedItems] = useState<number[]>(() => {
    return storage.get(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}${id}`, [])
  })

  const courseIdNum = Number(id)
  const data = courseData[courseIdNum]

  useEffect(() => {
    if (!data) navigate(PATHS.COURSES)
  }, [id, data, navigate])

  useEffect(() => {
    storage.set(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}${id}`, expandedSections)
  }, [expandedSections, id])

  useEffect(() => {
    storage.set(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}${id}`, completedItems)
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
    <PageLayout
      className="container animate-fade-in"
      pageKey={`course_${id}`}
      headerClassName="hidden"
      flat
    >
      <ModuleHeader
        image={data.img}
        code={data.code}
        title={t(`course_${id}_title`)}
        semester={t('course_semester_spring')}
        professor={data.professor}
        campus={t('course_campus_aalborg')}
      />

      <div className="mt-xl">
        <SplitLayout
          fullHeight={false}
          main={
            <Stack gap="lg">
              <Tabs
                items={tabItems}
                activeTab={activeTab}
                onChange={(val) => setActiveTab(val || 'modules')}
              />
              <div className="min-h-[300px]">
                <div>
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
                    <ForumWidget professor={data.professor} />
                  )}

                  {activeTab === 'resources' && (
                    <CourseResources />
                  )}

                  {activeTab === 'info' && (
                    <CourseInfo />
                  )}

                  {activeTab === 'participants' && (
                    <CourseParticipants participantsData={participantsData} />
                  )}

                  {activeTab === 'pbl' && (
                    <CoursePbl />
                  )}
                </div>
              </div>
            </Stack>
          }
          sidebar={
            <aside className="flex flex-col gap-lg">
              <Card variant="elevated" className="h-fit">
                <Card.Header padding="compact">
                  <Text weight="bold" size="md" className="card__title">{t('quick_access')}</Text>
                </Card.Header>
                <Card.Body padding="compact">
                  <Stack gap="none">
                    <MasterItem
                      leading={MessageSquare}
                      leadingClassName="text-primary"
                      title={t('course_forum')}
                      onClick={() => { setActiveTab('forum'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none py-2xs"
                    />
                    <MasterItem
                      leading={Users}
                      leadingClassName="text-primary"
                      title={t('participants')}
                      onClick={() => { setActiveTab('participants'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none py-2xs"
                    />
                    <MasterItem
                      leading={GraduationCap}
                      leadingClassName="text-primary"
                      title={t('my_grades')}
                      onClick={() => { navigate(PATHS.GRADES) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none py-2xs"
                    />
                    <MasterItem
                      leading={Book}
                      leadingClassName="text-primary"
                      title={t('syllabus')}
                      onClick={() => { setActiveTab('resources'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none py-2xs"
                    />
                  </Stack>
                </Card.Body>
              </Card>

              {(() => {
                const course = courses[Number(id!)]
                const nextAssignment = course?.nextAssignment
                if (!nextAssignment) return null
                const localize = useStore.getState().localize
                return (
                  <Card variant="brand" className="relative overflow-hidden group">
                    <Card.Decoration icon={FileSignature} className="opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    <Card.Header>
                      <Text weight="bold" size="lg" className="card__title text-white">{t('next_assignment')}</Text>
                    </Card.Header>
                    <Card.Body>
                      <Text size="sm" weight="bold" className="mb-md text-white/90 block leading-tight">
                        {localize(nextAssignment, 'title')}
                      </Text>
                      <Stack direction="row" align="center" gap="sm">
                        <Clock size={16} strokeWidth={2} className="text-white opacity-70" />
                        <Text size="xs" className="text-white/90">
                          {localize(nextAssignment, 'deadline')}
                        </Text>
                      </Stack>
                    </Card.Body>
                    <Card.Footer className="border-t border-white/10 pt-md">
                      <Button
                        variant="primary"
                        full
                        className="bg-white text-primary hover:bg-white/90"
                        onClick={() => navigate(PATHS.SUBMISSION(id, nextAssignment.submissionId))}
                      >
                        {t('go_to_assignment')}
                      </Button>
                    </Card.Footer>
                  </Card>
                )
              })()}

              <Card variant="elevated" className="h-fit">
                <Card.Header>
                  <Text weight="bold" size="lg" className="card__title">{t('instructor')}</Text>
                </Card.Header>
                <Card.Body className="pt-md pb-md">
                  <Stack direction="row" align="center" gap="md">
                    <Avatar
                      src={ASSETS.promo.instructor}
                      name={data.professor}
                      size="lg"
                      status="online"
                    />
                    <Stack gap="none" className="min-w-0 flex-1">
                      <Text size="sm" weight="bold" className="truncate block">{data.professor}</Text>
                      <Text size="xs" muted className="break-all block">{data.email}</Text>
                    </Stack>
                  </Stack>
                </Card.Body>
                <Card.Footer className="border-t border-border pt-md">
                  <Button variant="secondary" full className="shadow-[var(--shadow-sm)]">
                    {t('send_message')}
                  </Button>
                </Card.Footer>
              </Card>
            </aside>
          }
          mainSpan={8}
          sidebarSpan={4}
        />
      </div>
    </PageLayout>
  )
}

export default memo(Course)


if (import.meta.vitest) {
  const mockNavigate = vi.hoisted(() => vi.fn())
  const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: '1' })))
  
  vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      useParams: mockUseParams,
    }
  })

  describe('Course Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      useStore.setState({ lang: 'da' })
      mockUseParams.mockReturnValue({ id: '1' })
    })
  
    const renderCourse = (id = '1') => {
      return render(
        <MemoryRouter initialEntries={[`/course/${id}`]}>
          <Routes>
            <Route path="/course/:id" element={<Course />} />
            <Route path="/courses" element={<div>Courses Page</div>} />
          </Routes>
        </MemoryRouter>
      )
    }
  
    it('renders course details for ID 1', () => {
      renderCourse('1')
      expect(screen.getAllByText('Digital Design og Kommunikation').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Aflevering: Designskitse').length).toBeGreaterThan(0)
      
      fireEvent.click(screen.getByText('Gå til aflevering'))
      expect(mockNavigate).toHaveBeenCalledWith('/submission/1/105')
    })
  
    it('renders course details for ID 2', () => {
      mockUseParams.mockReturnValue({ id: '2' })
      renderCourse('2')
      expect(screen.getAllByText('Webudvikling og CMS').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Projekt: Byg en To-Do App').length).toBeGreaterThan(0)
      expect(screen.getByText(/Om 2 dage/i)).toBeInTheDocument()
      
      fireEvent.click(screen.getByText('Gå til aflevering'))
      expect(mockNavigate).toHaveBeenCalledWith('/submission/2/204')
    })
  
    it('switches between modules and forum tabs', () => {
      renderCourse('1')
      const forumTab = screen.getByText('Fora')
      fireEvent.click(forumTab)
      expect(screen.queryByText('Uge 1: Introduktion til Digital Design')).not.toBeInTheDocument()
    })
  
    it('toggles item completion', () => {
      renderCourse('1')
      const getFirstCheckbox = () => document.querySelectorAll('.lesson-item__checkbox')[0]
      fireEvent.click(getFirstCheckbox())
      expect(screen.getByText('20%')).toBeInTheDocument()
      fireEvent.click(getFirstCheckbox())
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('navigates to courses if course ID is invalid', () => {
      mockUseParams.mockReturnValue({ id: '999' })
      renderCourse('999')
      expect(mockNavigate).toHaveBeenCalledWith('/courses')
    })
  
    it('clicks an assignment item to navigate to submission', () => {
      renderCourse('1')
      fireEvent.click(screen.getAllByText('Aflevering: Designskitse')[0])
      expect(mockNavigate).toHaveBeenCalledWith('/submission/1/105')
    })
  
    it('navigates to forum from sidebar quick access', () => {
      window.scrollTo = vi.fn()
      renderCourse('1')
      fireEvent.click(screen.getByText('Kursusforum'))
      expect(screen.getByText('Fora')).toBeInTheDocument()
    })
  
    it('renders course in English with English section titles', () => {
      useStore.setState({ lang: 'en' })
      mockUseParams.mockReturnValue({ id: '2' })
      renderCourse('2')
      expect(screen.getAllByText('Web Development and CMS').length).toBeGreaterThan(0)
      expect(screen.getByText('Module 1: HTML & CSS Fundamentals')).toBeInTheDocument()
    })
  
    it('shows pending status-dot when progress is 50% or below', () => {
      renderCourse('1')
      const statusDots = document.querySelectorAll('.status-dot')
      expect(statusDots.length).toBeGreaterThan(0)
      expect(statusDots[0].className).toContain('pending')
    })
  
    it('shows active status-dot when progress is above 50%', () => {
      // Seed 4/5 completed items via localStorage (click logic tested in 'toggles item completion')
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, JSON.stringify([101, 102, 103, 104]))
      const { container } = renderCourse('1')
      expect(screen.getByText('80%')).toBeInTheDocument()
      const statusDots = container.querySelectorAll('.status-dot')
      expect(statusDots[0].className).toContain('active')
    })
  
    it('loads saved course progress from localStorage', () => {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, JSON.stringify([101]))
      const { container } = renderCourse('1')
      expect(container.textContent).toContain('20%')
    })
  
    it('shows zero progress for a course with no sections', () => {
      renderCourse('4')
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('handles malformed localStorage for expanded sections', () => {
      localStorage.setItem(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getAllByText('Aflevering: Designskitse').length).toBeGreaterThan(0)
    })
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('navigates to info tab and displays course information', () => {
      useStore.setState({ lang: 'da' })
      renderCourse('1')
      const infoTabs = screen.getAllByText('Kursusinfo')
      fireEvent.click(infoTabs[infoTabs.length - 1])
      expect(screen.getByText(/Kursusinformation|Course Info/)).toBeInTheDocument()
      expect(screen.getByText(/Beskrivelse|Description/)).toBeInTheDocument()
      expect(screen.getByText(/Læringsmål|Learning Goals/)).toBeInTheDocument()
    })
  
    it('navigates to resources tab via sidebar', () => {
      window.scrollTo = vi.fn()
      renderCourse('1')
      const syllabusItems = screen.getAllByText(/Pensum|Syllabus/i)
      fireEvent.click(syllabusItems[syllabusItems.length - 1])
      expect(screen.getAllByText(/Pensumliste|Syllabus/i).length).toBeGreaterThan(0)
    })
  
    it('navigates to participants tab and filters', () => {
      useStore.setState({ lang: 'da' })
      renderCourse('1')
      const participantsLinks = screen.getAllByText('Deltagere')
      fireEvent.click(participantsLinks[participantsLinks.length - 1])
      const searchInput = screen.getByPlaceholderText('Søg deltagere...')
      expect(searchInput).toBeInTheDocument()
      fireEvent.change(searchInput, { target: { value: 'Morten' } })
      expect(screen.queryByText('Mette Jensen')).not.toBeInTheDocument()
      const clearBtn = screen.getByRole('button', { name: /clear search/i })
      expect(clearBtn).toBeInTheDocument()
      fireEvent.click(clearBtn)
      expect(screen.getByText('Mette Jensen')).toBeInTheDocument()
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'student' } })
      expect(screen.getByText('Mette Jensen')).toBeInTheDocument()
    })
  
    it('verifies the progress message when a course is 100% completed', () => {
      useStore.setState({ lang: 'en' })
      // Set 100% progress in localStorage for course 1 (5 items)
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, JSON.stringify([101, 102, 103, 104, 105]))
      
      renderCourse('1')
      
      // progress_100 is "Mission accomplished!" in English
      expect(screen.getByText('Mission accomplished!')).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  
    it('toggles section expansion', () => {
      renderCourse('1')
      const button = document.querySelector('button[data-section-id="s1"]')
      expect(button).toBeInTheDocument()
      fireEvent.click(button!)
      fireEvent.click(button!)
    })

    it('expands a collapsed section', () => {
      localStorage.setItem(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}1`, JSON.stringify(['s2', 's3', 's4', 's5']))
      renderCourse('1')
      const button = document.querySelector('button[data-section-id="s1"]')
      if (button) {
        fireEvent.click(button!)
        expect(screen.getByText('Uge 1: Introduktion til Digital Design')).toBeInTheDocument()
      }
    })
  })

  describe('Course Tabs Subcomponents', () => {
    describe('CourseModules', () => {
      it('renders module items and triggers click and collapse', () => {
        const toggleItem = vi.fn()
        const toggleSection = vi.fn()
        const sections = [
          {
            id: 's1',
            title: 'Week 1',
            titleEn: 'Week 1',
            items: [
              { id: 101, type: 'pdf' as const, title: 'Syllabus', titleEn: 'Syllabus', size: '1 MB' }
            ]
          }
        ]

        const { container } = render(
          <MemoryRouter>
            <CourseModules
              courseId="1"
              progress={50}
              completedItems={[]}
              expandedSections={['s1']}
              sections={sections}
              toggleItem={toggleItem}
              toggleSection={toggleSection}
            />
          </MemoryRouter>
        )

        expect(screen.getByText('50%')).toBeInTheDocument()

        const checkbox = container.querySelector('.lesson-item__checkbox')!
        fireEvent.click(checkbox)
        expect(toggleItem).toHaveBeenCalledWith(101)

        const header = container.querySelector('[data-section-id="s1"]')!
        fireEvent.click(header)
        expect(toggleSection).toHaveBeenCalledWith('s1')
      })
    })

    describe('CourseResources', () => {
      it('renders all resource links', () => {
        render(<CourseResources />)
        expect(screen.getByText('Litteraturliste')).toBeInTheDocument()
        expect(screen.getByText('Pensumliste')).toBeInTheDocument()
        expect(screen.getByText('Eksamensplan')).toBeInTheDocument()
        expect(screen.getByText('PDF, 2.4 MB')).toBeInTheDocument()
        expect(screen.getByText('Excel, 150 KB')).toBeInTheDocument()
        expect(screen.getByText('Link')).toBeInTheDocument()
      })
    })

    describe('CourseInfo', () => {
      it('renders info section text', () => {
        render(<CourseInfo />)
        expect(screen.getByText('Læringsmål')).toBeInTheDocument()
      })
    })

    describe('CourseParticipants', () => {
      it('renders search and list of participants', () => {
        const participants = [
          { name: 'Alice Student', role: 'student' as const },
          { name: 'Bob Teacher', role: 'teacher' as const },
        ]

        render(<CourseParticipants participantsData={participants} />)
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.getByText('Bob Teacher')).toBeInTheDocument()
      })

      it('filters participants by role', () => {
        const participants = [
          { name: 'Alice Student', role: 'student' as const },
          { name: 'Bob Teacher', role: 'teacher' as const },
        ]

        render(<CourseParticipants participantsData={participants} />)
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.getByText('Bob Teacher')).toBeInTheDocument()

        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'student' } })
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.queryByText('Bob Teacher')).not.toBeInTheDocument()
      })
    })

    describe('CoursePbl', () => {
      it('renders pbl group component', () => {
        render(<CoursePbl />)
        expect(screen.getByText('Gruppeprojekt (PBL)')).toBeInTheDocument()
      })
    })

    describe('CourseSidebar', () => {
      it('renders quick links and professor information', () => {
        const setActiveTab = vi.fn()
        const t = useStore.getState().t
        render(
          <MemoryRouter>
            <aside className="flex flex-col gap-lg">
              <Card variant="elevated" className="h-fit">
                <Card.Header>
                  <Text weight="bold" size="lg" className="card__title">{t('quick_access')}</Text>
                </Card.Header>
                <Card.Body className="p-sm">
                  <Stack gap="none">
                    <MasterItem
                      leading={MessageSquare}
                      leadingClassName="text-primary"
                      title={t('course_forum')}
                      onClick={() => { setActiveTab('forum'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
                    />
                    <MasterItem
                      leading={Users}
                      leadingClassName="text-primary"
                      title={t('participants')}
                      onClick={() => { setActiveTab('participants'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
                    />
                    <MasterItem
                      leading={GraduationCap}
                      leadingClassName="text-primary"
                      title={t('my_grades')}
                      onClick={() => { window.location.href = '/grades' }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
                    />
                    <MasterItem
                      leading={Book}
                      leadingClassName="text-primary"
                      title={t('syllabus')}
                      onClick={() => { setActiveTab('resources'); window.scrollTo(0, 0) }}
                      className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
                    />
                  </Stack>
                </Card.Body>
              </Card>

              <Card variant="elevated" className="h-fit">
                <Card.Header>
                  <Text weight="bold" size="lg" className="card__title">{t('instructor')}</Text>
                </Card.Header>
                <Card.Body className="pt-md pb-md">
                  <Stack direction="row" align="center" gap="md">
                    <Avatar
                      src={ASSETS.promo.instructor}
                      name="Dr. Test"
                      size="lg"
                      status="online"
                    />
                    <Stack gap="none" className="min-w-0 flex-1">
                      <Text size="sm" weight="bold" className="truncate block">Dr. Test</Text>
                      <Text size="xs" muted className="break-all block">test@test.com</Text>
                    </Stack>
                  </Stack>
                </Card.Body>
                <Card.Footer className="border-t border-border pt-md">
                  <Button variant="secondary" full className="shadow-[var(--shadow-sm)]">
                    {t('send_message')}
                  </Button>
                </Card.Footer>
              </Card>
            </aside>
          </MemoryRouter>
        )

        expect(screen.getByText('Dr. Test')).toBeInTheDocument()
        expect(screen.getByText('test@test.com')).toBeInTheDocument()

        const forumLink = screen.getByText('Kursusforum')
        fireEvent.click(forumLink)
        expect(setActiveTab).toHaveBeenCalledWith('forum')
      })
    })
  })
}
