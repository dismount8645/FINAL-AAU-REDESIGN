import { useState } from 'react';
import { Book, BookOpen, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Card, Heading, Text } from '@/components/ui';
import type { CourseSection } from '@/lib/types';
import LessonItemRow from './LessonItemRow';
import LiteratureItemRow from './LiteratureItemRow';

interface CourseSectionCardProps {
  section: CourseSection
  courseId: string
  completedItems: number[]
  isExpanded: boolean
  toggleSection: (id: string) => void
  toggleItem: (id: number) => void
  lang: string
  t: (key: string) => string
  navigate: any
}

function CourseSectionCard({
  section,
  courseId,
  completedItems,
  isExpanded,
  toggleSection,
  toggleItem,
  lang,
  t,
  navigate,
}: CourseSectionCardProps) {
  const [themesOpen, setThemesOpen] = useState(false)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [materialsOpen, setMaterialsOpen] = useState(true)

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
                  {primaryLitItems.length > 0 && (
                    <div className="flex flex-col gap-2xs">
                      <Text size="2xs" weight="bold" muted className="uppercase tracking-wider font-bold">
                        {t('primary_literature')}
                      </Text>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                        {primaryLitItems.map((item) => (
                          <LiteratureItemRow
                            key={item.id}
                            item={item}
                            isCompleted={completedItems.includes(item.id)}
                            lang={lang}
                            toggleItem={toggleItem}
                            t={t}
                          />
                        ))}
                      </div>
                  </div>
                )}

                {secondaryLitItems.length > 0 && (
                  <div className="flex flex-col gap-2xs">
                    <Text size="2xs" weight="bold" muted className="uppercase tracking-wider font-bold">
                      {t('secondary_literature')}
                    </Text>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                      {secondaryLitItems.map((item) => (
                        <LiteratureItemRow
                          key={item.id}
                          item={item}
                          isCompleted={completedItems.includes(item.id)}
                          lang={lang}
                          toggleItem={toggleItem}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                )}

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
                          navigate={navigate}
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
}

export default CourseSectionCard
