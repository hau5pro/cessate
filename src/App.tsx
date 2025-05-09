import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Suspense, lazy, useEffect } from 'react';

import { AppRoutes } from '@utils/constants';
import Layout from '@layouts/Layout';
import Loading from '@components/Loading';
import { initAuth } from '@services/authService';
import { useAuthStore } from '@store/useAuthStore';
import { useInitApp } from './useInitApp';

const HomePage = lazy(() => import('@pages/home/Home'));
const LoginPage = lazy(() => import('@pages/login/Login'));
const SettingsPage = lazy(() => import('@pages/settings/Settings'));
const HistoryPage = lazy(() => import('@pages/history/History'));
const StatsPage = lazy(() => import('@pages/stats/Stats'));
const NotFoundPage = lazy(() => import('@pages/notFound/NotFound'));

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  // bootstrap
  useInitApp();

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAllowed = AppRoutes.AUTHENTICATED_ROUTES.includes(
      location.pathname
    );

    if (user) {
      if (location.pathname === AppRoutes.LOGIN || !isAllowed) {
        navigate(AppRoutes.HOME);
      }
    } else {
      if (location.pathname !== AppRoutes.LOGIN) {
        navigate(AppRoutes.LOGIN);
      }
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <Suspense
      fallback={
        <div style={{ width: '100vw', height: '100vh' }}>
          <Loading />
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path={AppRoutes.HOME} element={<HomePage />} />
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
          <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
          <Route path={AppRoutes.HISTORY} element={<HistoryPage />} />
          <Route path={AppRoutes.STATS} element={<StatsPage />} />
          <Route path={AppRoutes.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
