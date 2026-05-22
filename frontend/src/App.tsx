import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, type ReactNode } from 'react';
import { AuthContext } from './contexts/AuthContext';

import LandingPage from './pages/landing/LendingPage'; 
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import WorkspaceLayout from './pages/workspace/WorkspaceLayout'; 
import WorkspacePage from './pages/workspace/WorkspacePage';

// ДОДАВ ІМПОРТИ СТОРІНОК КУРСІВ
import { MyCourses } from './pages/workspace/MyCourses';
import { CourseFeed } from './pages/workspace/CourseFeed';
import { CourseDetail } from './pages/workspace/CourseDetail';
import { ChannelChat } from './pages/workspace/chat/ChannelChat';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  if (!auth?.user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  if (auth?.user) {
    return <Navigate to="/workspace" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Публічна зона */}
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/auth/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/auth/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* ПРИВАТНА ЗОНА */}
      <Route 
        path="/workspace" 
        element={
          <PrivateRoute>
            <WorkspaceLayout />
          </PrivateRoute>
        }
      >
        {/* /workspace (нічого не обрано) */}
        <Route index element={<WorkspacePage />} />
        
        {/* /workspace/profile */}
        <Route path="profile" element={<div style={{ padding: '24px' }}><h2>Тут буде Профіль</h2></div>} />
        
        {/* /workspace/groups/* */}
        {/* /workspace/groups/ */}
        <Route path="groups">
          <Route index element={<div style={{ padding: '24px' }}><h2>Вибери групу в сайдбарі</h2></div>} />
          
          {/* Роут для чату/дошки (поки заглушка) */}
          <Route path=":groupId/channels/:channelId" element={<ChannelChat />} />
          {/* Роут для курсу ВСЕРЕДИНІ групи */}
          <Route path=":groupId/courses/:courseId" element={<CourseDetail />} />
        </Route>
        
        {/* /workspace/courses/ */}
        <Route path="courses">
          <Route index element={<MyCourses />} />
          <Route path="my" element={<MyCourses />} />
          <Route path="feed" element={<CourseFeed />} />
          
          {/* Роут для курсу НАПРЯМУ (без групи) */}
          <Route path=":courseId" element={<CourseDetail />} />
        </Route>

        {/* /workspace/settings/* */}
        <Route path="settings/*" element={<div style={{ padding: '24px' }}><h2>Сторінка налаштувань</h2></div>} />
      </Route>

      {/* Глобальний фолбек */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;