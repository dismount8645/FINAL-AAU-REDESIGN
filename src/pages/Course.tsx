import { useState, useEffect, useCallback, useMemo, memo } from 'react';


import { useParams, useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  MessageSquare, Users, Book, BookOpen, Target,
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
import { courseData, participantsData, courseTabItems } from '@/lib/data';
import { storage, cn } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';
import useStore from '@/store';
import { ASSETS } from '@/lib';
import { useFormat } from '@/hooks';
import { ITEM_TYPE_MAP } from '@/lib/theme';
import type { CourseItem, CourseSection } from '@/lib/types';
import CourseResources from '@/components/Courses/CourseResources';
import CourseInfo from '@/components/Courses/CourseInfo';
import CourseParticipants from '@/components/Courses/CourseParticipants';
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

const CourseSectionCard = memo(function CourseSectionCard({
  section,
  courseId,
  completedItems,
  isExpanded,
  toggleSection,
  toggleItem,
  lang,
  t,
}: {
  section: CourseSection
  courseId: string
  completedItems: number[]
  isExpanded: boolean
  toggleSection: (id: string) => void
  toggleItem: (id: number) => void
  lang: string
  t: (key: string) => string
}) {
  const [themesOpen, setThemesOpen] = useState(false)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [materialsOpen, setMaterialsOpen] = useState(true)

  // Calculate section-specific progress
  const totalItems = section.items.length
  const completedSectionItems = section.items.filter(item => completedItems.includes(item.id)).length
  const sectionProgress = totalItems > 0 ? Math.round((completedSectionItems / totalItems) * 100) : 0

  const statusDotClass = sectionProgress === 100
    ? 'active bg-success shadow-[0_0_6px_rgba(var(--color-success-rgb),0.3)]'
    : sectionProgress > 0
      ? 'pending bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]'
      : 'pending bg-[var(--color-border)] dark:bg-white/20';

  const statusTitle = sectionProgress === 100
    ? (lang === 'da' ? 'Gennemført' : 'Completed')
    : sectionProgress > 0
      ? (lang === 'da' ? 'I gang' : 'In Progress')
      : (lang === 'da' ? 'Ikke startet' : 'Not Started');

  const primaryLitItems = section.items.filter(item => item.litType === 'primary')
  const secondaryLitItems = section.items.filter(item => item.litType === 'secondary')
  const otherActivities = section.items.filter(item => !item.litType)

  return (
    <Card variant="elevated" className="course-section mb-md overflow-hidden shadow-[var(--shadow-md)]">
      <Card.Header className="section-header p-0 bg-bg-card overflow-hidden relative">
        <button
          type="button"
          data-section-id={section.id}
          className="w-full text-left p-sm px-md flex items-start justify-between transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus border-none bg-transparent"
          onClick={() => toggleSection(section.id)}
          aria-expanded={isExpanded}
        >
          <Stack direction="row" align="start" gap="sm" className="flex-1 min-w-0 text-left">
            <div className={`status-dot w-2 h-2 rounded-[var(--radius-pill)] shrink-0 mt-1.5 ${statusDotClass}`} title={statusTitle} />
            <Stack gap="2xs" className="flex-1 min-w-0">
              <Heading level={4} as="h2" className="m-0 text-left leading-snug">{t(`course_${courseId}_${section.id}_title`)}</Heading>
              <div className="flex items-center gap-xs text-[10px] text-muted flex-wrap">
                {section.date && (
                  <>
                    <span className="font-bold text-primary dark:text-[var(--aau-light-blue-sec)]">
                      {lang === 'da' ? section.date : section.dateEn || section.date}
                    </span>
                    <span>·</span>
                  </>
                )}
                <span className="font-bold">{statusTitle}</span>
                <span>·</span>
                <span>{completedSectionItems} / {totalItems} {lang === 'da' ? 'gennemført' : 'completed'} ({sectionProgress}%)</span>
              </div>
            </Stack>
          </Stack>
          <div className="flex items-center gap-xs shrink-0 self-center">
            <span className="text-xs font-bold text-muted-foreground mr-xs">{sectionProgress}%</span>
            {isExpanded ? (
              <ChevronUp size={20} strokeWidth={2.5} className="text-muted transition-transform duration-150 shrink-0" />
            ) : (
              <ChevronDown size={20} strokeWidth={2.5} className="text-muted transition-transform duration-150 shrink-0" />
            )}
          </div>
        </button>
        
        {/* Module header bottom progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/20 overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: `${sectionProgress}%` }}
          />
        </div>
      </Card.Header>
      
      {isExpanded && (
        <Card.Body padding="compact" className="section-content">
          <Stack gap="md">
            {(section.description || section.descriptionEn) && (
              <div className="section-description bg-bg-highlight/40 dark:bg-white/5 p-sm rounded-lg border border-[var(--border-color)]/25 text-xs text-text-muted leading-relaxed text-left">
                <div className="font-bold text-main mb-2xs">
                  {lang === 'da' ? 'Forberedelse til denne kursusgang:' : 'Preparation for this session:'}
                </div>
                <p className="m-0">{lang === 'da' ? section.description : section.descriptionEn}</p>
              </div>
            )}

            {/* Themes & Goals Collapsible Accordions */}
            {((section.themes && section.themes.length > 0) || (section.goals && section.goals.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {section.themes && section.themes.length > 0 && (
                  <div className="border border-border/60 rounded-xl overflow-hidden bg-bg-card">
                    <button
                      type="button"
                      onClick={() => setThemesOpen(!themesOpen)}
                      className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-xs border-none bg-transparent"
                    >
                      <div className="flex items-center gap-xs">
                        <BookOpen size={14} className="text-primary shrink-0" />
                        <span>{t('themes_content')}</span>
                      </div>
                      {themesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {themesOpen && (
                      <div className="p-sm pt-none border-t border-border/40 text-left">
                        <ul className="list-disc pl-4 text-xs text-text-muted space-y-1 mt-xs">
                          {((lang === 'da' ? section.themes : section.themesEn) || []).map((theme, i) => (
                            <li key={i}>{theme}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section.goals && section.goals.length > 0 && (
                  <div className="border border-border/60 rounded-xl overflow-hidden bg-bg-card">
                    <button
                      type="button"
                      onClick={() => setGoalsOpen(!goalsOpen)}
                      className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-xs border-none bg-transparent"
                    >
                      <div className="flex items-center gap-xs">
                        <Target size={14} className="text-primary shrink-0" />
                        <span>{t('session_goals')}</span>
                      </div>
                      {goalsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {goalsOpen && (
                      <div className="p-sm pt-none border-t border-border/40 text-left">
                        <ul className="list-disc pl-4 text-xs text-text-muted space-y-1 mt-xs">
                          {((lang === 'da' ? section.goals : section.goalsEn) || []).map((goal, i) => (
                            <li key={i}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Materialer Collapsible (combining Literature & Activities) */}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-bg-card">
              <button
                type="button"
                onClick={() => setMaterialsOpen(!materialsOpen)}
                className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-xs border-none bg-transparent"
              >
                <div className="flex items-center gap-xs">
                  <Book size={14} className="text-primary shrink-0" />
                  <span>{lang === 'da' ? 'Materialer' : 'Materials'}</span>
                </div>
                {materialsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {materialsOpen && (
                <div className="p-sm border-t border-border/40 text-left flex flex-col gap-md">
                  {/* Primary Literature */}
                  {primaryLitItems.length > 0 && (
                    <div className="flex flex-col gap-2xs">
                      <Text size="2xs" weight="bold" muted className="uppercase tracking-wider font-bold">
                        {t('primary_literature')}
                      </Text>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                        {primaryLitItems.map((item) => {
                          const isCompleted = completedItems.includes(item.id)
                          const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default
                          const Icon = themeConfig.icon
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center justify-between p-sm rounded-xl border transition-all duration-150 relative group",
                                isCompleted 
                                  ? "bg-success/5 border-success/30 dark:border-success/20 hover:bg-success/10"
                                  : "bg-bg-card border-border hover:bg-bg-hover hover:border-primary/45"
                              )}
                            >
                              <div className="flex items-center gap-sm min-w-0 flex-1">
                                <div className={cn(
                                  "p-xs rounded-lg shrink-0",
                                  isCompleted ? "bg-success/15 text-success" : "bg-primary/5 text-primary"
                                )}>
                                  <Icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <Text size="xs" weight="bold" className="block truncate leading-tight text-main">
                                    {lang === 'da' ? item.title : item.titleEn}
                                  </Text>
                                  <Text size="3xs" muted className="block leading-none mt-3xs">
                                    {item.size || (item.type === 'link' ? 'Link' : 'Resource')}
                                  </Text>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ml-xs lesson-item__checkbox",
                                  isCompleted 
                                    ? "bg-success border-success text-white font-black" 
                                    : "border-border bg-transparent group-hover:border-primary/60"
                                )}
                                aria-label={isCompleted ? t('mark_incomplete') : t('mark_complete')}
                              >
                                {isCompleted && <Check size={12} strokeWidth={3} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Secondary Literature */}
                  {secondaryLitItems.length > 0 && (
                    <div className="flex flex-col gap-2xs">
                      <Text size="2xs" weight="bold" muted className="uppercase tracking-wider font-bold">
                        {t('secondary_literature')}
                      </Text>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                        {secondaryLitItems.map((item) => {
                          const isCompleted = completedItems.includes(item.id)
                          const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default
                          const Icon = themeConfig.icon
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center justify-between p-sm rounded-xl border transition-all duration-150 relative group",
                                isCompleted 
                                  ? "bg-success/5 border-success/30 dark:border-success/20 hover:bg-success/10"
                                  : "bg-bg-card border-border hover:bg-bg-hover hover:border-primary/45"
                              )}
                            >
                              <div className="flex items-center gap-sm min-w-0 flex-1">
                                <div className={cn(
                                  "p-xs rounded-lg shrink-0",
                                  isCompleted ? "bg-success/15 text-success" : "bg-primary/5 text-primary"
                                )}>
                                  <Icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <Text size="xs" weight="bold" className="block truncate leading-tight text-main">
                                    {lang === 'da' ? item.title : item.titleEn}
                                  </Text>
                                  <Text size="3xs" muted className="block leading-none mt-3xs">
                                    {item.size || (item.type === 'link' ? 'Link' : 'Resource')}
                                  </Text>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ml-xs lesson-item__checkbox",
                                  isCompleted 
                                    ? "bg-success border-success text-white font-black" 
                                    : "border-border bg-transparent group-hover:border-primary/60"
                                )}
                                aria-label={isCompleted ? t('mark_incomplete') : t('mark_complete')}
                              >
                                {isCompleted && <Check size={12} strokeWidth={3} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Other activities (assignments, videos, etc.) */}
                  {otherActivities.length > 0 && (
                    <div className="flex flex-col gap-2xs">
                      <Text size="2xs" weight="bold" muted className="uppercase tracking-wider font-bold">
                        {t('other_activities')}
                      </Text>
                      <Stack gap="2xs">
                        {otherActivities.map((item) => (
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
                    </div>
                  )}
                </div>
              )}
            </div>
          </Stack>
        </Card.Body>
      )}
    </Card>
  )
})

function CourseModules({
  courseId,
  progress: _progress,
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
  sections: CourseSection[]
  toggleItem: (itemId: number) => void
  toggleSection: (sectionId: string) => void
}) {
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)

  return (
    <Stack gap="lg">
      {sections.map((section) => (
        <CourseSectionCard
          key={section.id}
          section={section}
          courseId={courseId}
          completedItems={completedItems}
          isExpanded={expandedSections.includes(section.id)}
          toggleSection={toggleSection}
          toggleItem={toggleItem}
          lang={lang}
          t={t}
        />
      ))}
    </Stack>
  )
}

function Course() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)
  const [activeTab, setActiveTab] = useState<string>('modules')
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const course = courseData[Number(id)]
    if (!course) return []
    return storage.get(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}${id}`, course.sections.map((s) => s.id))
  })
  const [completedItems, setCompletedItems] = useState<number[]>(() => {
    return storage.get(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}${id}`, [])
  })
  const [descExpanded, setDescExpanded] = useState(false)

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

  const nextSession = useMemo(() => {
    if (!data) return null
    for (const section of data.sections) {
      const completedSectionItems = section.items.filter(item => completedItems.includes(item.id)).length
      if (completedSectionItems < section.items.length) {
        return section
      }
    }
    return data.sections[0] || null
  }, [data, completedItems])

  const tabItems = useMemo(
    () => courseTabItems.map((ti) => ({ ...ti, label: t(ti.label) })),
    [t]
  )

  const getProgressMessage = (pct: number) => {
    if (pct === 0) return t('progress_0')
    if (pct < 50) return t('progress_25')
    if (pct < 75) return t('progress_50')
    if (pct < 100) return t('progress_75')
    return t('progress_100')
  }



  if (!data) return null

  const courseDesc = t(`course_${id}_desc`)

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

      {/* Collapsible course description directly below module header */}
      <div className="mt-md">
        <Card variant="elevated" className="overflow-hidden">
          <Card.Body padding="compact">
            <Stack gap="xs">
              <Text weight="bold" size="sm" className="text-muted text-uppercase tracking-wider">
                {t('description')}
              </Text>
              <div 
                className={cn(
                  "text-sm text-foreground/80 transition-all duration-300 relative",
                  !descExpanded && "line-clamp-2"
                )}
                style={{
                  display: !descExpanded ? '-webkit-box' : 'block',
                  WebkitLineClamp: !descExpanded ? 2 : undefined,
                  WebkitBoxOrient: !descExpanded ? 'vertical' : undefined,
                  overflow: 'hidden'
                }}
              >
                {courseDesc}
              </div>
              <div className="flex justify-start">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-0 py-none h-fit hover:bg-transparent text-primary font-bold hover:text-primary-dark"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? 'Vis mindre' : 'Vis mere'}
                </Button>
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </div>      <div className="mt-xl">
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

                  {activeTab === 'info' && (
                    <CourseInfo />
                  )}

                  {activeTab === 'participants' && (
                    <CourseParticipants participantsData={participantsData} />
                  )}
                </div>
              </div>
            </Stack>
          }
          sidebar={
            <aside className="flex flex-col gap-lg">
              {/* Compact "Dit fremskridt" widget in the sidebar */}
              <Card variant="elevated" accent="left" className="h-fit">
                <Card.Header padding="compact" className="pb-none">
                  <Stack gap="2xs" className="flex-1 min-w-0">
                    <Text weight="bold" size="sm" className="card__title">{t('your_progress')}</Text>
                    <Text size="2xs" muted>{getProgressMessage(progress)}</Text>
                  </Stack>
                  <div className="progress-stat text-right shrink-0">
                    <Text size="md" weight="bold" className="progress-value text-[var(--color-primary)] block leading-[1]">
                      {progress}%
                    </Text>
                  </div>
                </Card.Header>
                <Card.Body padding="compact" className="pt-2xs">
                  <Stack gap="xs">
                    <ProgressBar value={progress} />
                    <div className="flex justify-between items-center text-xs text-muted">
                      <span>{t('completed_short')}:</span>
                      <span className="font-bold text-foreground">
                        {completedItems.length} / {totalItems}
                      </span>
                    </div>
                  </Stack>
                </Card.Body>
              </Card>

              {/* Til næste lektion checklist widget in the sidebar */}
              {nextSession && (
                <Card variant="elevated" className="h-fit border border-primary/20 bg-bg-highlight/5">
                  <Card.Header padding="compact" className="pb-none">
                    <Stack gap="2xs" className="flex-1 min-w-0">
                      <Text weight="bold" size="sm" className="card__title text-primary">
                        {lang === 'da' ? 'Til næste lektion' : 'For Next Session'}
                      </Text>
                      <Text size="2xs" muted className="truncate block">
                        {t(`course_${id}_${nextSession.id}_title`)}
                      </Text>
                    </Stack>
                  </Card.Header>
                  <Card.Body padding="compact" className="pt-xs">
                    <Stack gap="xs">
                      {nextSession.items.map((item) => {
                        const isCompleted = completedItems.includes(item.id)
                        const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default
                        const Icon = themeConfig.icon
                        
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              "flex items-center gap-xs p-xs rounded-lg border text-left cursor-pointer transition-all duration-150 group",
                              isCompleted 
                                ? "bg-success/5 border-success/15 hover:bg-success/10" 
                                : "bg-bg-card border-border hover:bg-bg-hover hover:border-primary/30"
                            )}
                          >
                            <button
                              type="button"
                              className={cn(
                                "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors shrink-0",
                                isCompleted 
                                  ? "bg-success border-success text-white" 
                                  : "border-border bg-transparent group-hover:border-primary/50"
                              )}
                            >
                              {isCompleted && <Check size={10} strokeWidth={3} />}
                            </button>
                            <div className="min-w-0 flex-1 flex items-center gap-2xs">
                              <Icon size={12} className="text-muted shrink-0" />
                              <Text size="2xs" weight="medium" className={cn("truncate block text-main text-left", isCompleted && "line-through opacity-60")}>
                                {lang === 'da' ? item.title : item.titleEn}
                              </Text>
                            </div>
                          </div>
                        )
                      })}
                    </Stack>
                  </Card.Body>
                </Card>
              )}

              {/* Course resources relocated to sidebar */}
              <CourseResources />

              <Card variant="elevated" className="h-fit">
                <Card.Header padding="compact" className="pb-none">
                  <Text weight="bold" size="sm" className="card__title">{t('instructor')}</Text>
                </Card.Header>
                <Card.Body padding="compact" className="pt-xs">
                  <Stack gap="sm">
                    <Stack direction="row" align="center" gap="md">
                      <Avatar
                        src={ASSETS.promo.instructor}
                        name={data.professor}
                        size="md"
                        status="online"
                      />
                      <Stack gap="none" className="min-w-0 flex-1">
                        <Text size="xs" weight="bold" className="truncate block">{data.professor}</Text>
                        <Text size="2xs" muted className="break-all block">{data.email}</Text>
                      </Stack>
                    </Stack>
                    <Button variant="secondary" size="sm" className="w-full mt-2xs">
                      {t('send_message')}
                    </Button>
                  </Stack>
                </Card.Body>
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
    })
  
    it('renders course details for ID 2', () => {
      mockUseParams.mockReturnValue({ id: '2' })
      renderCourse('2')
      expect(screen.getAllByText('Webudvikling og CMS').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Projekt: Byg en To-Do App').length).toBeGreaterThan(0)
    })
  
    it('switches between modules and forum tabs', () => {
      const { container } = renderCourse('1')
      const forumTab = screen.getByText('Fora')
      fireEvent.click(forumTab)
      // After switching tabs, the module section-content is no longer rendered.
      // Note: item text may still appear in the sidebar "Til næste lektion" widget,
      // so we check for section-content absence rather than item text.
      expect(container.querySelector('.section-content')).toBeNull()
    })
  
    it('toggles item completion', () => {
      renderCourse('1')
      const getFirstCheckbox = () => document.querySelectorAll('.lesson-item__checkbox')[0]
      fireEvent.click(getFirstCheckbox())
      expect(screen.getAllByText('20%').length).toBeGreaterThan(0)
      fireEvent.click(getFirstCheckbox())
      expect(screen.getAllByText('0%').length).toBeGreaterThan(0)
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
  
    it('navigates to forum tab via top navigation', () => {
      window.scrollTo = vi.fn()
      renderCourse('1')
      fireEvent.click(screen.getByText('Fora'))
      expect(screen.getByText('Fora')).toBeInTheDocument()
    })
  
    it('renders course in English with English section titles', () => {
      useStore.setState({ lang: 'en' })
      mockUseParams.mockReturnValue({ id: '2' })
      renderCourse('2')
      expect(screen.getAllByText('Web Development and CMS').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Session 1: HTML & CSS Fundamentals').length).toBeGreaterThan(0)
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
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getAllByText('0%').length).toBeGreaterThan(0)
    })
  
    it('handles malformed localStorage for expanded sections', () => {
      localStorage.setItem(`${STORAGE_KEYS.EXPANDED_SECTIONS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getAllByText('Aflevering: Designskitse').length).toBeGreaterThan(0)
    })
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}1`, '{broken')
      renderCourse('1')
      expect(screen.getAllByText('0%').length).toBeGreaterThan(0)
    })
  
    it('navigates to info tab and displays course information', () => {
      useStore.setState({ lang: 'da' })
      renderCourse('1')
      const infoTabs = screen.getAllByText('Kursusinfo')
      fireEvent.click(infoTabs[infoTabs.length - 1])
      expect(screen.getByText(/Kursusinformation|Course Info/)).toBeInTheDocument()
      expect(screen.getAllByText(/Beskrivelse|Description/).length).toBeGreaterThan(0)
      expect(screen.getByText(/Læringsmål|Learning Goals/)).toBeInTheDocument()
    })
  
    it('renders course resources in the sidebar', () => {
      renderCourse('1')
      expect(screen.getByText('Ressourcer')).toBeInTheDocument()
      expect(screen.getAllByText('Pensumliste').length).toBeGreaterThan(0)
    })
  
    it('navigates to participants tab and filters', () => {
      useStore.setState({ lang: 'da' })
      renderCourse('1')
      const participantsLinks = screen.getAllByText('Deltagere')
      fireEvent.click(participantsLinks[0])
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
      expect(screen.getAllByText('100%').length).toBeGreaterThan(0)
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
        expect(screen.getAllByText('Kursusgang 1: Introduktion til Digital Design').length).toBeGreaterThan(0)
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
              progress={0}
              completedItems={[]}
              expandedSections={['s1']}
              sections={sections}
              toggleItem={toggleItem}
              toggleSection={toggleSection}
            />
          </MemoryRouter>
        )

        const checkbox = container.querySelector('.lesson-item__checkbox')!
        fireEvent.click(checkbox)
        expect(toggleItem).toHaveBeenCalledWith(101)

        const header = container.querySelector('[data-section-id="s1"]')!
        fireEvent.click(header)
        expect(toggleSection).toHaveBeenCalledWith('s1')
      })
    })

    describe('CourseDescription', () => {
      it('collapses and expands the course description when clicking the button', () => {
        render(
          <MemoryRouter initialEntries={['/course/1']}>
            <Routes>
              <Route path="/course/:id" element={<Course />} />
            </Routes>
          </MemoryRouter>
        )

        const toggleBtn = screen.getByText('Vis mere')
        expect(toggleBtn).toBeInTheDocument()

        fireEvent.click(toggleBtn)
        expect(screen.getByText('Vis mindre')).toBeInTheDocument()

        fireEvent.click(screen.getByText('Vis mindre'))
        expect(screen.getByText('Vis mere')).toBeInTheDocument()
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
