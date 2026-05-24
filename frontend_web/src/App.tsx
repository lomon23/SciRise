import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { WorkspaceLayout } from './pages/workspace/WorkspaceLayout';
import { GroupsLayout } from './pages/groups/GroupsLayout';
import { CoursesLayout } from './pages/courses/CoursesLayout'; // Імпорт
import { ChatArea } from './pages/chats/ChatArea';
import { CoursePlayer } from './components/sidebar/courses/CoursePlayer'; // Імпорт
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/workspace" element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="groups" replace />} />
          
          {/* МОДУЛЬ ГРУП */}
          <Route path="groups/*" element={<GroupsLayout />}>
            <Route index element={<div>Оберіть канал або групу зліва</div>} />
            <Route path=":groupId/channels/:channelId" element={<ChatArea />} />
          </Route>

          {/* МОДУЛЬ КУРСІВ */}
          <Route path="courses/*" element={<CoursesLayout />}>
            <Route index element={<div>Оберіть курс зі списку ліворуч</div>} />
            <Route path=":courseId" element={<CoursePlayer />} />
          </Route>

          {/* НАЛАШТУВАННЯ */}
          <Route path="settings/*" element={<div>Налаштування</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;