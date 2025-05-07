import './App.css';

import { Route, Routes, useLocation, useNavigate } from 'react-router';

import { AppRoutes } from '@utils/constants';
import HistoryPage from '@pages/history/History';
import HomePage from '@pages/home/Home';
import Layout from '@layouts/Layout';
import LoginPage from '@pages/login/Login';
import NotFoundPage from '@pages/notFound/NotFound';
import SettingsPage from '@pages/settings/Settings';
import { initAuth } from '@services/authService';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useInitSession } from '@features/sessions/useInitSession';
import { useInitUserSettings } from '@features/userSettings/useInitUserSettings';

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  // bootstrap
  useInitUserSettings();
  useInitSession();

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
    <Routes>
      <Route element={<Layout />}>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
        <Route path={AppRoutes.HISTORY} element={<HistoryPage />} />
        <Route path={AppRoutes.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
