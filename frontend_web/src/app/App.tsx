import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import { use_auth_store } from '../entities/session/authStore';

function App() {
    const accessToken = use_auth_store((state) => state.access_token);

    return (
        <div className="app-container">
            <Routes>
                {accessToken ? (
                    <>
                        <Route path="/dashboard" element={<div>Панель керування SciRise</div>} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;