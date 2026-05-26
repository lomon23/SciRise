import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { WorkspaceLayout } from './pages/workspace/WorkspaceLayout';
import { GroupsLayout } from './pages/groups/GroupsLayout';
import { CoursesLayout } from './pages/courses/CoursesLayout'; // Імпорт
import { ChatArea } from './pages/chats/ChatArea';
import { CoursePlayer } from './components/sidebar/courses/CoursePlayer'; // Імпорт
import { CreateLesson } from './components/sidebar/courses/CreateLesson';
import { Whiteboard } from './components/board/Whiteboard';
import { VoiceChannelPage } from './pages/voice/VoiceChannelPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { MainCourse } from './pages/courses/MainCourse';
import { MainGroup } from './pages/groups/MainGroup';
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/workspace" element={<WorkspaceLayout />}>
          <Route index element={<Navigate to="groups" replace />} />
          <Route path="settings/*" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="groups/*" element={<GroupsLayout />}>
            <Route index element={<MainGroup />} />
            <Route path=":groupId/channels/:channelId" element={<ChatArea />} />
            <Route path=":groupId/courses/:courseId" element={<CoursePlayer />} />
            <Route path=":groupId/board" element={<Whiteboard />} />
            
            {/* ТУТ БУЛА ПОМИЛКА: ДОДАНО :groupId/ */}
            <Route path=":groupId/voice/:channelId" element={<VoiceChannelPage />} />
          </Route>

          {/* МОДУЛЬ КУРСІВ */}
          <Route path="courses/*" element={<CoursesLayout />}>
            <Route index element={<MainCourse />} />
            <Route path=":courseId" element={<CoursePlayer />} />
            <Route path=":courseId/modules/:moduleId/create-lesson" element={<CreateLesson />} />

          </Route>


          {/* НАЛАШТУВАННЯ */}
          <Route path="settings/*" element={<div>Налаштування</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;