import { lazy, type ComponentType, type LazyExoticComponent } from 'react';


const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Calendar = lazy(() => import('@/pages/Calendar'))
const Courses = lazy(() => import('@/pages/Courses'))
const Course = lazy(() => import('@/pages/Course'))
const Support = lazy(() => import('@/pages/Support'))
const Settings = lazy(() => import('@/pages/Settings'))
const Messages = lazy(() => import('@/pages/Messages'))
const Resources = lazy(() => import('@/pages/Resources'))
const Notifications = lazy(() => import('@/pages/Notifications'))
const Submission = lazy(() => import('@/pages/Submission'))
const SearchResults = lazy(() => import('@/pages/SearchResults'))
const ForumPost = lazy(() => import('@/pages/ForumPost'))
const Grades = lazy(() => import('@/pages/Grades'))
const Favorites = lazy(() => import('@/pages/Favorites'))

interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
  label: string;
}

const routes: RouteConfig[] = [
  { path: '/', component: Dashboard, label: 'dashboard' },
  { path: '/calendar', component: Calendar, label: 'calendar' },
  { path: '/courses', component: Courses, label: 'courses' },
  { path: '/course/:id', component: Course, label: 'course' },
  { path: '/support', component: Support, label: 'support' },
  { path: '/settings', component: Settings, label: 'settings' },
  { path: '/messages', component: Messages, label: 'messages' },
  { path: '/resources', component: Resources, label: 'resources' },
  { path: '/notifications', component: Notifications, label: 'notifications' },
  { path: '/submission/:courseId/:assignmentId', component: Submission, label: 'submission' },
  { path: '/search', component: SearchResults, label: 'search' },
  { path: '/grades', component: Grades, label: 'grades' },
  { path: '/favorites', component: Favorites, label: 'favorites' },
  { path: '/forum/:id', component: ForumPost, label: 'forum' },
]

export default routes

if (import.meta.vitest) {
  describe('routes', () => {
    it('has the correct number of routes', () => {
      expect(routes).toHaveLength(14)
    })
  
    it('each route has required fields', () => {
      for (const route of routes) {
        expect(route).toHaveProperty('path')
        expect(route).toHaveProperty('component')
        expect(route).toHaveProperty('label')
      }
    })
  
    it('all paths are unique', () => {
      const paths = routes.map(r => r.path)
      expect(new Set(paths).size).toBe(paths.length)
    })
  
    it('all labels are unique', () => {
      const labels = routes.map(r => r.label)
      expect(new Set(labels).size).toBe(labels.length)
    })
  
    it('maps / to Dashboard', () => {
      expect(routes.find(r => r.path === '/')?.label).toBe('dashboard')
    })
  
    it('maps /calendar to calendar', () => {
      expect(routes.find(r => r.path === '/calendar')?.label).toBe('calendar')
    })
  
    it('maps /courses to courses', () => {
      expect(routes.find(r => r.path === '/courses')?.label).toBe('courses')
    })
  
    it('maps /course/:id to course', () => {
      expect(routes.find(r => r.path === '/course/:id')?.label).toBe('course')
    })
  
    it('maps /support to support', () => {
      expect(routes.find(r => r.path === '/support')?.label).toBe('support')
    })
  
    it('maps /settings to settings', () => {
      expect(routes.find(r => r.path === '/settings')?.label).toBe('settings')
    })
  
    it('maps /messages to messages', () => {
      expect(routes.find(r => r.path === '/messages')?.label).toBe('messages')
    })
  
    it('maps /resources to resources', () => {
      expect(routes.find(r => r.path === '/resources')?.label).toBe('resources')
    })
  
    it('maps /notifications to notifications', () => {
      expect(routes.find(r => r.path === '/notifications')?.label).toBe('notifications')
    })
  
    it('maps /grades to grades', () => {
      expect(routes.find(r => r.path === '/grades')?.label).toBe('grades')
    })
  
    it('maps /favorites to favorites', () => {
      expect(routes.find(r => r.path === '/favorites')?.label).toBe('favorites')
    })
  
    it('maps /search to search', () => {
      expect(routes.find(r => r.path === '/search')?.label).toBe('search')
    })
  
    it('maps /forum/:id to forum', () => {
      expect(routes.find(r => r.path === '/forum/:id')?.label).toBe('forum')
    })
  
    it('each route component is a lazy React component', () => {
      for (const route of routes) {
        expect(route.component.$$typeof).toBe(Symbol.for('react.lazy'))
      }
    })
  
    it('each lazy import resolves to a valid module', async () => {
      for (const route of routes) {
        const factory = (route.component as unknown as { _payload: { _result: () => Promise<{ default: unknown }> } })._payload._result
        const mod = await factory()
        expect(mod.default).toBeDefined()
      }
    })
  })
}
