import { Suspense } from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/Layout/ErrorBoundary';
import Layout from '@/components/Layout/Layout';
import useStore from '@/store';
import NotFound from '@/pages/NotFound';
import routes from './routes';

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

