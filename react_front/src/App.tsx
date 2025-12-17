import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import HeaderMainComp from './components/main_components/Header_Main_Comp';
import FooterMainComp from './components/main_components/Footer_Main_Comp';
import HeroSection from './components/main_components/Hero_Section';
import SettingsPage from './pages/workspace/settings';
import HomePage from './pages/workspace/home_page';
import ChatPage from './pages/chat/ChatPage';
import WorkspaceLayout from './pages/workspace/WorkspaceLayout';
import ProfilePage from './pages/workspace/profile';
import EditorPage from './pages/workspace/editor_page';

// 1. Імпорт провайдера
import { GoogleOAuthProvider } from '@react-oauth/google';

// Компонент-обгортка для логіки відображення Хедера/Футера
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const hideOnPaths = ['/login', '/register'];
  const isAuthPage = hideOnPaths.includes(location.pathname);
  const isWorkspace = location.pathname.startsWith('/workspace');
  const shouldShowMainLayout = !isWorkspace && !isAuthPage;

  return (
    <>
      {shouldShowMainLayout && <HeaderMainComp />}
      {children}
      {shouldShowMainLayout && <FooterMainComp />}
    </>
  );
};

// Твій Client ID (я прибрав зайвий пробіл в кінці, який був на скріні)
const GOOGLE_CLIENT_ID = "497030789238-9jtgjhprgtv8a5en7uq55f211dcpsj6u.apps.googleusercontent.com";

const App: React.FC = () => {
  return (
    // 2. Обгортаємо весь додаток
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Layout>
          <Routes>
            {/* Головна сторінка */}
            <Route path="/" element={<HeroSection />} />

            {/* Сторінки авторизації */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Вкладені маршрути для Workspace */}
            <Route path="/workspace" element={<WorkspaceLayout />}>
              <Route index element={<HomePage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="editor/:id" element={<EditorPage />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;