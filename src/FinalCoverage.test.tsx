import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Topbar from '@/components/layout/Topbar'
import Resources from '@/pages/Resources'
import Courses from '@/pages/Courses'
import SearchResults from '@/pages/SearchResults'
import { MemoryRouter, useLocation, Routes, Route } from 'react-router-dom'
import useStore from '@/store/useStore'
import { ToastProvider } from '@/context/providers/ToastProvider'
import { PersistedStateSchema } from '@/lib/schemas/store'

import { formatDate, formatFullDate, formatTime } from '@/utils/dates'
import { env } from '@/utils/env'
import { storage } from '@/utils/storage'

import CourseResources from '@/pages/course/CourseResources'
import CourseSidebar from '@/pages/course/CourseSidebar'
import CourseTabContent from '@/pages/course/CourseTabContent'
import CoursesFilters from '@/pages/courses/CoursesFilters'
import GradesFilter from '@/pages/grades/GradesFilter'
import Grades from '@/pages/Grades'
import ForumRepliesList from '@/pages/forumPost/ForumRepliesList'
import ForumPost from '@/pages/ForumPost'
import Settings from '@/pages/Settings'
import Submission from '@/pages/Submission'
import FavoritesList from '@/pages/favorites/FavoritesList'
import { linkifyText } from '@/pages/support/FaqSection'
import * as submissionsApi from '@/api/submissions'
import { WidgetGrid } from '@/pages/dashboard/WidgetGrid'
import RecentGradesWidget from '@/widgets/RecentGradesWidget'
import { ChatSidebar } from '@/pages/messages/ChatSidebar'
import NotificationItemRow from '@/pages/notifications/NotificationItemRow'
import HighlightText from '@/pages/searchResults/HighlightText'
import { Bell } from 'lucide-react'

vi.mock('@/data/mockData', async () => {
  const actual = await vi.importActual('@/data/mockData') as any
  return {
    ...actual,
    mockGradesData: []
  }
})

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }))
  }
})

describe('Final Coverage Sweep', () => {
  it('covers formatters', () => {
    const d = new Date('2026-05-28T12:00:00')
    expect(formatDate(d, 'en')).toBeDefined()
    expect(formatDate(d, 'da')).toBeDefined()
    expect(formatFullDate(d, 'en')).toBeDefined()
    expect(formatTime(d, 'en')).toBeDefined()
  })

  it('covers env safety methods', () => {
    const originalOpen = window.open;
    delete (window as any).open;
    expect(env.open('http://example.com')).toBeNull()
    window.open = originalOpen;

    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      get: () => { throw new Error('Simulated error') }
    });
    expect(env.getInnerWidth()).toBe(0)
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true, writable: true });

    const originalMatchMedia = window.matchMedia;
    delete (window as any).matchMedia;
    const fallbackMm = env.matchMedia('(max-width: 600px)')
    expect(fallbackMm.matches).toBe(false)
    ;(fallbackMm as any).addListener()
    ;(fallbackMm as any).removeListener()
    ;(fallbackMm as any).addEventListener()
    ;(fallbackMm as any).removeEventListener()
    expect((fallbackMm as any).dispatchEvent()).toBe(false)
    window.matchMedia = originalMatchMedia;

    const originalSelf = window.self;
    Object.defineProperty(window, 'self', {
      get: () => { throw new Error('Simulated self error') }
    });
    expect(env.isIframe()).toBe(true)
    Object.defineProperty(window, 'self', { value: originalSelf, configurable: true, writable: true });
  })

  it('covers env safety methods when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(env.getInnerWidth()).toBe(0)
    expect(env.isIframe()).toBe(false)
    expect(env.open('http://example.com')).toBeNull()
    expect(env.matchMedia('(max-width: 600px)').matches).toBe(false)
    vi.unstubAllGlobals()
  })

  it('covers storage resilience', () => {
    localStorage.setItem('test_json_err', 'invalid-json')
    expect(storage.get('test_json_err', { a: 1 })).toEqual({ a: 1 })
    expect(storage.get('test_json_err', 'fallback-string')).toBe('invalid-json')
    
    const originalGetItem = localStorage.getItem
    localStorage.getItem = () => { throw new Error('Simulated getItem error') }
    expect(storage.get('test_json_err', 'fallback')).toBe('fallback')
    localStorage.getItem = originalGetItem

    const originalSetItem = localStorage.setItem
    localStorage.setItem = () => { throw new Error('Simulated setItem error') }
    storage.set('test_key', 'val')
    localStorage.setItem = originalSetItem

    const originalRemoveItem = localStorage.removeItem
    localStorage.removeItem = () => { throw new Error('Simulated removeItem error') }
    storage.remove('test_key')
    localStorage.removeItem = originalRemoveItem


    const originalWindow = global.window
    // @ts-expect-error - testing override
    delete global.window
    try {
      expect(storage.get('test_key', 'fallback')).toBe('fallback')
      storage.set('test_key', 'val')
      storage.remove('test_key')
    } finally {
  
      global.window = originalWindow
    }
  })

  it('covers store persist functions', () => {
    const originalParse = PersistedStateSchema.parse
    PersistedStateSchema.parse = () => { throw new Error('Simulated parsing error') }

    const options = useStore.persist.getOptions()
    const migrated = options.migrate?.({ invalidField: true }, 0)
    expect(migrated).toBeDefined()
    
    const rehydrateCallback = (options.onRehydrateStorage as any)?.()
    if (rehydrateCallback) {
      rehydrateCallback({ lang: 'invalid-lang-type' } as any)
    }

    PersistedStateSchema.parse = originalParse
  })

  it('covers favoriteSlice clearFavorites', () => {
    useStore.getState().clearFavorites()
    expect(useStore.getState().favorites).toEqual([])
  })

  it('covers uiSlice key resolver fallbacks', () => {
    expect(useStore.getState().t('non.existent.key')).toBe('non.existent.key')
    expect(useStore.getState().localize(null as any)).toBe('')
    expect(useStore.getState().localize({ someField: 'val' })).toBe('')
  })

  it('covers Topbar dropdowns in English', () => {
    useStore.setState({ lang: 'en', notificationCount: 1, messageCount: 1 })
    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    )

    // Open notifications
    const bellBtn = screen.getByLabelText(/notifications/i)
    fireEvent.click(bellBtn)
    const notifItem = screen.getByText(/Project Report/i)
    expect(notifItem).toBeInTheDocument()
    fireEvent.click(notifItem)
    expect(mockNavigate).toHaveBeenCalledWith('/notifications')

    // Open messages
    const mailBtn = screen.getByLabelText(/messages/i)
    fireEvent.click(mailBtn)
    const msgItem = screen.getByText(/Mette Jensen/i)
    expect(msgItem).toBeInTheDocument()
    fireEvent.click(msgItem)
    expect(mockNavigate).toHaveBeenCalledWith('/messages')
  })

  it('covers forum and course star toggle in Courses', () => {
    useStore.setState({ lang: 'da' })
    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    )
    const stars = screen.getAllByLabelText(/favorit/i)
    // Click first one (Course) and last one (Forum)
    fireEvent.click(stars[0])
    fireEvent.click(stars[stars.length - 1])
  })

  it('covers search in English in Courses', () => {
    useStore.setState({ lang: 'en' })
    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    )
    const searchInput = screen.getByPlaceholderText(/Search/i)
    fireEvent.change(searchInput, { target: { value: 'Digital' } })
  })

  it('covers tool click and star toggle in Resources', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    // Add a favorite tool to cover the Quick Access section
    useStore.setState({ 
      lang: 'da',
      favorites: [{ id: 'tool-1', type: 'tool', entityId: 1, addedAt: Date.now(), order: 0 }] 
    })
    
    render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    )

    // Click tool in Quick Access
    const quickTool = screen.getAllByText('Digital Eksamen')[0]
    fireEvent.click(quickTool.closest('.info-card')!)
    expect(windowOpenSpy).toHaveBeenCalled()

    // Click star in Essentials section
    const essentialStars = screen.getAllByLabelText(/favorit/i)
    fireEvent.click(essentialStars[essentialStars.length - 1])
    
    windowOpenSpy.mockRestore()
  })

  it('covers HighlightText with empty query', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: '/search', search: '' } as any)
    render(
      <MemoryRouter initialEntries={['/search']}>
        <SearchResults />
      </MemoryRouter>
    )
  })

  it('covers CourseResources click callbacks', () => {
    const { container } = render(<CourseResources />)
    const listItems = container.querySelectorAll('.cursor-pointer')
    listItems.forEach(item => {
      fireEvent.click(item)
    })
  })

  it('covers CourseSidebar for different courseIds', () => {
    const setActiveTab = vi.fn()
    
    // Test course 2
    const { rerender } = render(
      <MemoryRouter>
        <CourseSidebar courseId="2" professor="Prof" email="prof@aau.dk" setActiveTab={setActiveTab} />
      </MemoryRouter>
    )
    const btn = screen.getByRole('button', { name: /Gå til aflevering/i })
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/submission/2/204')

    // Test course 3
    rerender(
      <MemoryRouter>
        <CourseSidebar courseId="3" professor="Prof" email="prof@aau.dk" setActiveTab={setActiveTab} />
      </MemoryRouter>
    )
  })

  it('covers CourseTabContent activeTab pbl', () => {
    const toggleItem = vi.fn()
    const toggleSection = vi.fn()
    render(
      <CourseTabContent
        activeTab="pbl"
        courseId="1"
        progress={50}
        completedItems={[]}
        expandedSections={[]}
        sections={[]}
        toggleItem={toggleItem}
        toggleSection={toggleSection}
        participantsData={[]}
        professor="Prof"
      />
    )
    expect(screen.getByText('Gruppeprojekt (PBL)')).toBeInTheDocument()
  })

  it('covers CoursesFilters dropdown item selection', () => {
    const setSearchQuery = vi.fn()
    const setSortOrder = vi.fn()
    const setSortBy = vi.fn()
    const setActiveFilter = vi.fn()
    render(
      <CoursesFilters
        searchQuery=""
        setSearchQuery={setSearchQuery}
        sortOrder="asc"
        setSortOrder={setSortOrder}
        sortBy="alpha"
        setSortBy={setSortBy}
        activeFilter={null}
        setActiveFilter={setActiveFilter}
        labelFilters={['TestLabel']}
      />
    )
    const filterBtn = screen.getByRole('button', { name: /filter/i })
    fireEvent.click(filterBtn)
    const item = screen.getByText('TestLabel')
    fireEvent.click(item)
    expect(setActiveFilter).toHaveBeenCalledWith('TestLabel')
  })

  it('covers Courses loading skeleton with meta mode mock', () => {
    const originalMode = import.meta.env.MODE
    import.meta.env.MODE = 'development'
    
    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    )
    
    import.meta.env.MODE = originalMode
  })

  it('covers Grades dashboard fallback branch', () => {
    const originalT = useStore.getState().t
    useStore.setState({
      t: (key: string) => key === 'dashboard' ? 'dashboard' : originalT(key)
    })
    
    render(
      <MemoryRouter>
        <Grades />
      </MemoryRouter>
    )
    
    useStore.setState({ t: originalT })
  })

  it('covers ForumRepliesList empty replies view', () => {
    render(<ForumRepliesList replies={[]} />)
    expect(screen.getByText(/Ingen svar endnu/i)).toBeInTheDocument()
  })

  it('covers ForumPost back button navigation', () => {
    render(
      <MemoryRouter initialEntries={['/forum-post/1']}>
        <Routes>
          <Route path="/forum-post/:id" element={<ForumPost />} />
        </Routes>
      </MemoryRouter>
    )
    const backBtn = screen.getByRole('button', { name: /Tilbage til forum/i })
    fireEvent.click(backBtn)
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('covers Settings tab header keyboard navigation', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Settings />
        </ToastProvider>
      </MemoryRouter>
    )
    const catHeader = document.querySelectorAll('.settings__cat-header')[0]
    fireEvent.keyDown(catHeader, { key: 'Enter' })
    fireEvent.keyDown(catHeader, { key: ' ' })
    fireEvent.keyDown(catHeader, { key: 'ArrowLeft' }) // ignored key
  })

  it('covers Submission form changes, API failure, and dropzone events', async () => {
    vi.spyOn(submissionsApi, 'submitAssignment').mockRejectedValue(new Error('Failed'))
    
    const { container } = render(
      <MemoryRouter initialEntries={['/submission/1/105']}>
        <Routes>
          <Route path="/submission/:courseId/:assignmentId" element={<Submission />} />
        </Routes>
      </MemoryRouter>
    )

    // Type comment
    const textarea = container.querySelector('textarea')!
    fireEvent.change(textarea, { target: { value: 'My comment' } })
    
    // Dropzone drag over and drop
    const dropzone = container.querySelector('.dropzone')!
    fireEvent.dragOver(dropzone)
    fireEvent.dragLeave(dropzone)
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(['foo'], 'foo.txt', { type: 'text/plain' })]
      }
    })

    // Keydown trigger dropzone file click
    fireEvent.keyDown(dropzone, { key: 'Enter' })
    fireEvent.keyDown(dropzone, { key: ' ' })
    fireEvent.keyDown(dropzone, { key: 'Escape' }) // ignored

    // Trigger submit
    const submitBtn = container.querySelector('.submission__submit-btn')!
    fireEvent.click(submitBtn)
  })

  it('covers FavoritesList drag leave', () => {
    const filtered = [
      { id: 'tool-1', type: 'tool' as const, entityId: 1, title: 'Exam', link: '/', icon: Bell, iconBg: '', iconColor: '' }
    ]
    const onRemove = vi.fn()
    const onReorder = vi.fn()
    const onNavigate = vi.fn()
    const onGoToDashboard = vi.fn()

    const { container } = render(
      <MemoryRouter>
        <FavoritesList
          filtered={filtered}
          lang="da"
          searchQuery=""
          typeFilter="all"
          t={(k) => k}
          onRemove={onRemove}
          onReorder={onReorder}
          onNavigate={onNavigate}
          onGoToDashboard={onGoToDashboard}
        />
      </MemoryRouter>
    )
    const favItemEl = container.querySelector('[draggable]')!
    fireEvent.dragLeave(favItemEl)
  })

  it('covers linkifyText utility non-http links', () => {
    render(<>{linkifyText('see support.its.aau.dk or http://test.com')}</>)
    const link = screen.getByText('support.its.aau.dk')
    expect(link).toHaveAttribute('href', 'https://support.its.aau.dk')
  })

  it('covers dashboard widget drag, drop, and resize controls', () => {
    const onDragStart = vi.fn()
    const onDragEnd = vi.fn()
    const onDragOver = vi.fn()
    const onDrop = vi.fn()
    const toggleVisibility = vi.fn()
    const resizeWidget = vi.fn()
    const moveWidget = vi.fn()

    const widgets = [
      { id: 'favorites', x: 0, y: 0, span: 12, rowSpan: 2, visible: true }
    ]

    const { container } = render(
      <MemoryRouter>
        <WidgetGrid
          isEditing={true}
          visibleWidgets={widgets}
          draggedItemId={null}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          toggleVisibility={toggleVisibility}
          resizeWidget={resizeWidget}
          t={(k) => k}
          moveWidget={moveWidget}
        />
      </MemoryRouter>
    )

    // Trigger dragOver and drop on overlay cells
    const cell = container.querySelectorAll('.absolute.inset-0.grid div')[0]
    fireEvent.dragOver(cell)
    fireEvent.drop(cell)

    // Trigger dragOver and drop on WidgetWrapper item
    const wrapperItem = container.querySelector('.dashboard__widget')!
    fireEvent.dragOver(wrapperItem)
    fireEvent.drop(wrapperItem)

    // Resize width handle mouse down & touch start
    const widthHandle = container.querySelector('[title="resize_width"]')!
    fireEvent.mouseDown(widthHandle, { clientX: 100, clientY: 100 })
    fireEvent.touchStart(widthHandle, {
      touches: [{ clientX: 100, clientY: 100 }]
    })

    // Resize height handle mouse down & touch start
    const heightHandle = container.querySelector('[title="resize_height"]')!
    fireEvent.mouseDown(heightHandle, { clientX: 100, clientY: 100 })
    fireEvent.touchStart(heightHandle, {
      touches: [{ clientX: 100, clientY: 100 }]
    })

    // Keydown ArrowLeft and ArrowRight on reorder grip handle
    const gripBtn = screen.getByLabelText(/drag_to_reorder/i)
    fireEvent.keyDown(gripBtn, { key: 'ArrowLeft' })
    expect(moveWidget).toHaveBeenCalledWith('favorites', 'left')

    fireEvent.keyDown(gripBtn, { key: 'ArrowRight' })
    expect(moveWidget).toHaveBeenCalledWith('favorites', 'right')
  })

  it('covers RecentGradesWidget empty state', () => {
    // Render widget (will import mocked empty mockGradesData)
    render(
      <MemoryRouter>
        <RecentGradesWidget span={12} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
  })

  it('covers HighlightText early return for empty query', () => {
    const { container } = render(<HighlightText text="Hello World" query="" />)
    expect(container.textContent).toBe('Hello World')
  })

  it('covers GradesFilter onChange callbacks', () => {
    const setSearchQuery = vi.fn()
    const setSemester = vi.fn()
    render(
      <GradesFilter
        searchQuery="Math"
        setSearchQuery={setSearchQuery}
        selectedSemester="all"
        setSelectedSemester={setSemester}
        semesterOptions={['all', 'E2024']}
      />
    )
    // onClear fires when value non-empty and clear button clicked
    const clearBtn = screen.getByLabelText(/clear search/i)
    fireEvent.click(clearBtn)
    expect(setSearchQuery).toHaveBeenCalledWith('')

    // onChange on the text input
    const searchInput = screen.getByPlaceholderText(/søg|search/i)
    fireEvent.change(searchInput, { target: { value: 'New' } })
    expect(setSearchQuery).toHaveBeenCalledWith('New')

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'E2024' } })
    expect(setSemester).toHaveBeenCalledWith('E2024')
  })

  it('covers ChatSidebar onKeyDown keyboard handler', () => {
    const setActiveContactId = vi.fn()
    const setShowChat = vi.fn()
    const archiveContact = vi.fn()
    const restoreContact = vi.fn()
    const contacts = [
      { id: 1, name: 'Alice', msg: 'Hey', time: '10:00', unread: true, archived: false, role: 'student', messages: [] }
    ]
    render(
      <ChatSidebar
        view="active"
        setView={vi.fn()}
        filteredContacts={contacts}
        activeContactId={0}
        setActiveContactId={setActiveContactId}
        setShowChat={setShowChat}
        archiveContact={archiveContact}
        restoreContact={restoreContact}
        t={(k) => k}
      />
    )
    // The contact row has role="button" via Stack; archive button also has role="button"
    const allButtons = screen.getAllByRole('button')
    // First button is the contact row Stack element
    const contactEl = allButtons[0]
    fireEvent.keyDown(contactEl, { key: 'Enter' })
    expect(setActiveContactId).toHaveBeenCalledWith(1)
    expect(setShowChat).toHaveBeenCalledWith(true)

    fireEvent.keyDown(contactEl, { key: ' ' })
    expect(setActiveContactId).toHaveBeenCalledTimes(2)

    // Ignored key
    fireEvent.keyDown(contactEl, { key: 'Escape' })
    expect(setActiveContactId).toHaveBeenCalledTimes(2)
  })

  it('covers NotificationItemRow onKeyDown keyboard handler', () => {
    const onSelect = vi.fn()
    const notif = {
      id: 1,
      type: 'Assignment',
      course: 'Math',
      text: 'New assignment',
      date: new Date(),
      isRead: false,
      archived: false,
      content: 'New assignment',
      link: '/submission/1/101',
    }
    render(
      <NotificationItemRow
        notif={notif}
        isSelected={false}
        view="active"
        lang="en"
        t={(k) => k}
        getIcon={() => Bell}
        onSelect={onSelect}
        onMarkRead={vi.fn()}
        onArchive={vi.fn()}
        onRestore={vi.fn()}
      />
    )
    // Row has role="button"; mark-read and archive buttons also present — get the row (first)
    const allButtons = screen.getAllByRole('button')
    const row = allButtons[0]
    fireEvent.keyDown(row, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(row, { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(2)

    // Ignored key
    fireEvent.keyDown(row, { key: 'Tab' })
    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it('covers env.open warn when window.open undefined', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const originalOpen = window.open
    // @ts-expect-error - testing override
    delete window.open
    const result = env.open('http://example.com')
    expect(result).toBeNull()
    expect(warnSpy).toHaveBeenCalled()
    window.open = originalOpen
    warnSpy.mockRestore()
  })

  it('covers env.open catch branch when window.open throws', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const originalOpen = window.open
    window.open = () => { throw new Error('blocked') }
    const result = env.open('http://example.com')
    expect(result).toBeNull()
    expect(errorSpy).toHaveBeenCalled()
    window.open = originalOpen
    errorSpy.mockRestore()
  })

  it('covers env.matchMedia catch branch', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      get: () => { throw new Error('matchMedia unavailable') },
      configurable: true,
    })
    const result = env.matchMedia('(max-width: 600px)')
    expect(result.matches).toBe(false)
    Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia, configurable: true, writable: true })
    errorSpy.mockRestore()
  })
})
