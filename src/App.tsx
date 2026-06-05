import { Suspense, lazy } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/Layout/ErrorBoundary';
import Layout from '@/components/Layout/Layout';
import useStore from '@/store';
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

  return (
    <Router>
      <a href="#main-content" className="skip-link">{t('skip_to_content')}</a>
      <ErrorBoundary>
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
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

