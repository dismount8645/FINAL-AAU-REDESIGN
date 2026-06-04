import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useParams, useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';
import { CourseSidebar, CourseBreadcrumbs, CourseTabContent } from '@/components/Courses';
import { Grid } from '@/components/LayoutPrimitives';
import ModuleHeader from '@/components/ModuleHeader';
import { Stack } from '@/components/LayoutPrimitives';
import Tabs from '@/components/Tabs';
import { courseData, participantsData, courseTabItems } from '@/lib/courseData';
import { storage } from '@/lib/storage';
import useStore from '@/lib/store';

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


if (import.meta.vitest) {
  // Mock react-router-dom
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: vi.fn(),
      useParams: vi.fn()
    }
  })
  describe('Course Page', () => {
    const mockNavigate = vi.fn()
    
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      useStore.setState({ lang: 'da' })
      vi.mocked(useNavigate).mockReturnValue(mockNavigate)
      vi.mocked(useParams).mockReturnValue({ id: '1' })
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
      vi.mocked(useParams).mockReturnValue({ id: '2' })
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
      vi.mocked(useParams).mockReturnValue({ id: '999' })
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
      vi.mocked(useParams).mockReturnValue({ id: '2' })
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
      localStorage.setItem('courseProgress_1', JSON.stringify([101, 102, 103, 104]))
      const { container } = renderCourse('1')
      expect(screen.getByText('80%')).toBeInTheDocument()
      const statusDots = container.querySelectorAll('.status-dot')
      expect(statusDots[0].className).toContain('active')
    })
  
    it('loads saved course progress from localStorage', () => {
      localStorage.setItem('courseProgress_1', JSON.stringify([101]))
      const { container } = renderCourse('1')
      expect(container.textContent).toContain('20%')
    })
  
    it('shows zero progress for a course with no sections', () => {
      renderCourse('4')
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem('courseProgress_1', '{broken')
      renderCourse('1')
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  
    it('handles malformed localStorage for expanded sections', () => {
      localStorage.setItem('expandedSections_1', '{broken')
      renderCourse('1')
      expect(screen.getAllByText('Aflevering: Designskitse').length).toBeGreaterThan(0)
    })
  
    it('handles malformed localStorage for course progress', () => {
      localStorage.setItem('courseProgress_1', '{broken')
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
      localStorage.setItem('courseProgress_1', JSON.stringify([101, 102, 103, 104, 105]))
      
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
  })
}
