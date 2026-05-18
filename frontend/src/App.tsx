import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

// Імпортуємо сторінки (поки вони пусті, але роутер вже буде готовий)
import LandingPage from './pages/landing/LendingPage';
import WorkspacePage from './pages/workspace/WorkspacePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Компонент-захисник для приватних роутів
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);
  // Якщо юзера немає — кидаємо на логін
  if (!auth?.user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

// Захисник для публічних роутів (щоб залогінений не міг зайти на /login)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);
  // Якщо юзер вже залогінений — кидаємо відразу у воркспейс
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

      {/* Приватна зона (тільки для залогінених) */}
      <Route path="/workspace/*" element={
        <PrivateRoute>
          <WorkspacePage />
        </PrivateRoute>
      } />

      {/* Якщо ввели якусь діч у URL — кидаємо на головну */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;