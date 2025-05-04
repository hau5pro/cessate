import './App.css';

import { Route, Routes, useNavigate } from 'react-router';

import HomePage from '@pages/home/Home';
import Layout from '@layouts/Layout';
import LoginPage from '@pages/login/Login';
import NotFoundPage from '@pages/notFound/NotFound';
import TrackerPage from '@pages/tracker/Tracker';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/tracker');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

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
