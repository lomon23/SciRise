import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import { use_auth_store } from './store/authStore'

function App() {
  const accessToken = use_auth_store((state) => state.access_token)

  return (
    <div className="app-container">
      <Routes>
        {!accessToken ? (
          <>
            {/* ТУТ МАЄ БУТИ Route, А НЕ path */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<div>Панель керування SciRise</div>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App