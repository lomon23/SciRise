import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Navbar from './components/layout/Navbar';
import MainPage from './pages/MainPage';
import ChatPage from './pages/ChatPage';
import VideoPage from './pages/VideoPage';
import Onboarding from './components/profile/Onboarding';
import { use_auth_store } from './store/authStore';

function App() {
  const accessToken = use_auth_store((state) => state.access_token);

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        {/* Головна доступна завжди, але контент всередині міняється */}
        <Route path="/" element={<MainPage />} />

        {!accessToken ? (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* Якщо не залогований і лізе кудись не туди — на логін */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Тільки для залогованих */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/onboarding" element={<Onboarding />} /> {/* Додали сюди! */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;