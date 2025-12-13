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
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/workspace');

  return (
    <>
      {!isWorkspace && <HeaderMainComp />}
      {children}
      {!isWorkspace && <FooterMainComp />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <div style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<main><HeroSection /></main>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Вкладені маршрути для Workspace */}
            <Route path="/workspace" element={<WorkspaceLayout />}>
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Новий маршрут для редактора */}
                <Route path="editor" element={<EditorPage />} />
            </Route>
          </Routes>
        </div>
      </Layout>
    </Router>
  );
};

export default App;