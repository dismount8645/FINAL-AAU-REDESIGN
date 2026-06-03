import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import NotFound from '@/pages/NotFound';
import routes from '@/routes';
import useStore from '@/store/useStore';

function App() {
  const t = useStore(state => state.t)
  const _lang = useStore(state => state.lang)
  void _lang
  return (
    <Router>
      <a href="#main-content" className="skip-link">{t('skip_to_content')}</a>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </Router>
  );
}

export default App;
