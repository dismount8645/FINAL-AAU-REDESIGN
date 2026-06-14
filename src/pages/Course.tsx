import { useState, useEffect, useCallback, useMemo, memo } from 'react';


import { useParams, useNavigate } from 'react-router-dom';
import {
  Book, BookOpen, Target,
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
      className="rounded-[var(--radius-md)] border-none bg-bg-highlight/20 hover:bg-bg-highlight/40"
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
        <div className="flex items-center gap-xs shrink-0">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block",
            completed ? "text-success" : "text-text-secondary opacity-60"
          )}>
            {completed 
              ? t('course.completed') 
              : t('course.incomplete')}
          </span>
          <Button
            variant={completed ? 'primary' : 'ghost'}
            size="icon"
            className={`lesson-item__checkbox w-7 h-7 shrink-0 ${completed ? '' : isAutomatic ? 'border-dashed opacity-30 cursor-default border-border' : 'border-border hover:border-primary/50 dark:border-white/20'}`}
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
        </div>
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
    <Card id={`section-card-${section.id}`} variant="elevated" className="course-section mb-md overflow-hidden shadow-[var(--shadow-md)]">
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
                <p className="m-0">{lang === 'da' ? section.description : (section.descriptionEn || section.description)}</p>
              </div>
            )}

            {/* Themes & Goals Collapsible Accordions */}
            {((section.themes && section.themes.length > 0) || (section.goals && section.goals.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {section.themes && section.themes.length > 0 && (
                  <div className="rounded-xl overflow-hidden bg-bg-highlight/30 dark:bg-white/5 border-none shadow-none">
                    <button
                      type="button"
                      onClick={() => setThemesOpen(!themesOpen)}
                      className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-sm border-none bg-transparent"
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
                          {((lang === 'da' ? section.themes : (section.themesEn || section.themes)) || []).map((theme, i) => (
                            <li key={i}>{theme}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {section.goals && section.goals.length > 0 && (
                  <div className="rounded-xl overflow-hidden bg-bg-highlight/30 dark:bg-white/5 border-none shadow-none">
                    <button
                      type="button"
                      onClick={() => setGoalsOpen(!goalsOpen)}
                      className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-sm border-none bg-transparent"
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
                          {((lang === 'da' ? section.goals : (section.goalsEn || section.goals)) || []).map((goal, i) => (
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
            <div className="rounded-xl overflow-hidden bg-bg-highlight/30 dark:bg-white/5 border-none shadow-none">
              <button
                type="button"
                onClick={() => setMaterialsOpen(!materialsOpen)}
                className="w-full flex items-center justify-between p-sm text-left hover:bg-bg-hover transition-colors font-bold text-main text-sm border-none bg-transparent"
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
                              
                              <div className="flex items-center gap-xs shrink-0">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block",
                                isCompleted ? "text-success" : "text-text-secondary opacity-60"
                              )}>
                                {isCompleted 
                                  ? (lang === 'da' ? 'Fuldført' : 'Completed') 
                                  : (lang === 'da' ? 'Ikke fuldført' : 'Not completed')}
                              </span>
                              <Button
                                variant={isCompleted ? 'primary' : 'ghost'}
                                size="icon"
                                className={`lesson-item__checkbox w-7 h-7 shrink-0 border-border hover:border-primary/50 dark:border-white/20`}
                                onClick={() => toggleItem(item.id)}
                                aria-label={isCompleted ? t('mark_incomplete') : t('mark_complete')}
                                type="button"
                              >
                                {isCompleted ? (
                                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                                ) : (
                                  <Check
                                    size={16}
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                    className="opacity-0 group-hover:opacity-30 transition-opacity"
                                  />
                                )}
                              </Button>
                            </div>
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
                            
                            <div className="flex items-center gap-xs shrink-0">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block",
                                isCompleted ? "text-success" : "text-text-secondary opacity-60"
                              )}>
                                {isCompleted 
                                  ? (lang === 'da' ? 'Fuldført' : 'Completed') 
                                  : (lang === 'da' ? 'Ikke fuldført' : 'Not completed')}
                              </span>
                              <Button
                                variant={isCompleted ? 'primary' : 'ghost'}
                                size="icon"
                                className={`lesson-item__checkbox w-7 h-7 shrink-0 border-border hover:border-primary/50 dark:border-white/20`}
                                onClick={() => toggleItem(item.id)}
                                aria-label={isCompleted ? t('mark_incomplete') : t('mark_complete')}
                                type="button"
                              >
                                {isCompleted ? (
                                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                                ) : (
                                  <Check
                                    size={16}
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                    className="opacity-0 group-hover:opacity-30 transition-opacity"
                                  />
                                )}
                              </Button>
                            </div>
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

function CourseModulesAnchorNav({
  courseId,
  sections,
}: {
  courseId: string
  sections: CourseSection[]
}) {
  const t = useStore((state) => state.t)
  
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-card-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-[73px] bg-bg-card/95 backdrop-blur-md z-20 py-sm px-md -mx-md sm:mx-0 rounded-xl border border-border/60 shadow-sm flex items-center gap-xs overflow-x-auto no-scrollbar mb-md">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className="px-sm py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-bg-highlight/40 hover:bg-bg-highlight/85 text-text-secondary border border-border/40 hover:border-primary/50 transition-all duration-150"
        >
          {t(`course_${courseId}_${section.id}_title`)}
        </button>
      ))}
    </div>
  )
}

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
      <CourseModulesAnchorNav courseId={courseId} sections={sections} />
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
    setExpandedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((s) => s !== sectionId)
      }
      return [...prev, sectionId]
    })
  }, [])

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

export function CourseWrapper() {
  const { id } = useParams<{ id: string }>()
  return <Course key={id} />
}

export { Course, CourseModules }

export default memo(CourseWrapper)

