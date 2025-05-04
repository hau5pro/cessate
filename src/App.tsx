import "./App.css";

import { Route, Routes, useNavigate } from "react-router";

import HomePage from "@pages/home/Home";
import LoginPage from "@pages/login/Login";
import NotFoundPage from "@pages/notFound/NotFound";
import TrackerPage from "@pages/tracker/Tracker";
import { useAuthStore } from "@store/useAuthStore";

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/tracker" element={<TrackerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
