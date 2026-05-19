import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, ReactNode } from 'react';
import { AuthContext } from './contexts/AuthContext';

import LandingPage from './pages/landing/LendingPage'; 
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import WorkspaceLayout from './pages/workspace/WorkspaceLayout'; 
import WorkspacePage from './pages/workspace/WorkspacePage';

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
        
        {/* /workspace/groups/* (зірочка потрібна, бо там будуть підроути груп і чатів) */}
        <Route path="groups/*" element={<div style={{ padding: '24px' }}><h2>Робоча зона груп: Чат / Дошка</h2></div>} />
        
        {/* /workspace/settings/* */}
        <Route path="settings/*" element={<div style={{ padding: '24px' }}><h2>Сторінка налаштувань</h2></div>} />
      </Route>

      {/* Глобальний фолбек */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;