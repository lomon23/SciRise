import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import HeaderMainComp from './components/main_components/Header_Main_Comp';
import FooterMainComp from './components/main_components/Footer_Main_Comp';
import HeroSection from './components/main_components/Hero_Section';
import SettingsPage from './pages/workspace/settings';
import HomePage from './pages/workspace/home_page';
// Нові імпорти
import WorkspaceLayout from './pages/workspace/WorkspaceLayout';
import ProfilePage from './pages/workspace/profile'
import EditorPage from './pages/workspace/editor_page';

// Компонент-обгортка для логіки відображення Хедера/Футера
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // 1. Шляхи, де точно НЕ треба показувати загальний Хедер і Футер
  const hideOnPaths = ['/login', '/register'];

  // 2. Перевіряємо, чи ми зараз на одній з цих сторінок
  const isAuthPage = hideOnPaths.includes(location.pathname);

  // 3. Перевіряємо, чи ми у воркспейсі (там свій лейаут)
  const isWorkspace = location.pathname.startsWith('/workspace');

  // 4. Показуємо хедер/футер ТІЛЬКИ якщо це не воркспейс і не сторінка авторизації
  const shouldShowMainLayout = !isWorkspace && !isAuthPage;

  return (
    <>
      {shouldShowMainLayout && <HeaderMainComp />}
      {children}
      {shouldShowMainLayout && <FooterMainComp />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        {/* Я прибрав div з minHeight, щоб RegisterPage міг займати 100% висоти екрану сам по собі */}
        <Routes>
          {/* Головна сторінка */}
          <Route path="/" element={<main><HeroSection /></main>} />
          
          {/* Сторінки авторизації (без хедера/футера) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Вкладені маршрути для Workspace (зі своїм сайдбаром) */}
          <Route path="/workspace" element={<WorkspaceLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="editor/:id" element={<EditorPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;