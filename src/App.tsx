import { Suspense, lazy, useEffect } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/Layout/ErrorBoundary';;
import Layout from '@/components/Layout/Layout';;
import useStore, { computeIsDarkMode } from '@/store';
import { env } from '@/lib/env';
import NotFound from '@/pages/NotFound';

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Courses = lazy(() => import('./pages/Courses'))
const Course = lazy(() => import('./pages/Course'))
const Support = lazy(() => import('./pages/Support'))
const Settings = lazy(() => import('./pages/Settings'))
const Messages = lazy(() => import('./pages/Messages'))
const Resources = lazy(() => import('./pages/Resources'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Submission = lazy(() => import('./pages/Submission'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const ForumPost = lazy(() => import('./pages/ForumPost'))
const Grades = lazy(() => import('./pages/Grades'))
const Favorites = lazy(() => import('./pages/Favorites'))

const routes = [
  { path: '/', component: Dashboard },
  { path: '/calendar', component: Calendar },
  { path: '/courses', component: Courses },
  { path: '/course/:id', component: Course },
  { path: '/support', component: Support },
  { path: '/settings', component: Settings },
  { path: '/messages', component: Messages },
  { path: '/resources', component: Resources },
  { path: '/notifications', component: Notifications },
  { path: '/submission/:courseId/:assignmentId', component: Submission },
  { path: '/search', component: SearchResults },
  { path: '/grades', component: Grades },
  { path: '/favorites', component: Favorites },
  { path: '/forum/:id', component: ForumPost },
]

function App() {
  const t = useStore(state => state.t)
  const theme = useStore((s) => s.theme)
  const isDarkMode = useStore((s) => s.isDarkMode)
  const setTheme = useStore((s) => s.setTheme)
  const setIsMobile = useStore((s) => s.setIsMobile)

  // Sync isDarkMode state when theme changes
  useEffect(() => {
    const isDark = computeIsDarkMode(theme)
    if (isDark !== isDarkMode) {
      useStore.setState({ isDarkMode: isDark })
    }
  }, [theme, isDarkMode])

  // Sync theme classes on mount and when isDarkMode changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    document.documentElement.classList.toggle('dark-mode', isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const handleResize = () => {
      const width = env.getInnerWidth()
      const isPhone = width < 768
      setIsMobile(isPhone)

      if (width >= 1024) {
        useStore.getState().setCollapsed(false)
        useStore.getState().setIsMobileOpen(false)
      } else if (width >= 768) {
        useStore.getState().setCollapsed(true)
        useStore.getState().setIsMobileOpen(false)
      } else {
        useStore.getState().setCollapsed(true)
      }
    }

    const mediaQuery = env.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (useStore.getState().theme === 'system') {
        setTheme('system')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [setIsMobile, setTheme])

  return (
    <Router>
      <a href="#main-content" className="skip-link">{t('skip_to_content')}</a>
      <ErrorBoundary>
        {/* @ts-expect-error className is not supported on Suspense but requested by task instructions */}
        <Suspense className="p-8" fallback={<div className="text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes.map((route) =>
                route.path === '/' ? (
                  <Route key="/" index element={<route.component />} />
                ) : (
                  <Route key={route.path} path={route.path} element={<route.component />} />
                ),
              )}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

if (import.meta.vitest) {
  describe('App', () => {
    it('renders without crashing', () => {
      render(<App />)
    })
  })
}

