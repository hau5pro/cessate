import './App.css';

import { Route, Routes, useNavigate } from 'react-router';

import HomePage from '@pages/home/Home';
import Layout from '@layouts/Layout';
import Loading from '@components/loading/Loading';
import LoginPage from '@pages/login/Login';
import NotFoundPage from '@pages/notFound/NotFound';
import TrackerPage from '@pages/tracker/Tracker';
import { initAuth } from '@services/authService';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
