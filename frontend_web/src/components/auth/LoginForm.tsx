import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../../apis/authService';
import { use_auth_store } from '../../store/authStore';
import './LoginForm.css'; // Строго зовнішні стилі, ніякого інлайну!

const LoginForm = () => {
    // Зберігаємо логіку Остапа 1 в 1
    const set_access_token = use_auth_store((state) => state.set_access_token);
    const [user_email, set_user_email] = useState('');
    const [user_password, set_user_password] = useState('');
    const [error_message, set_error_message] = useState('');
    
    // Додаємо стейт завантаження для гарного UI (щоб кнопка блокувалась під час запиту)
    const [is_loading, set_is_loading] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        set_error_message('');
        set_is_loading(true);

        try {
            const response = await AuthService.login({ email: user_email, password: user_password });
            if (response.status === 200) {
                set_access_token(response.data.access);
                // Після сету токена, логіка додатку (App.tsx) сама перекине юзера, куди треба
            }
        } catch (error: any) {
            set_error_message(error.response?.data?.detail || 'Помилка авторизації');
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Сірий блок зліва (Заглушка для ілюстрації) */}
            <div className="login-image"></div>

            {/* Форма авторизації справа */}
            <div className="login-content">
                <div className="login-form-box">
                    <h2 className="login-title">Login</h2>
                    <p className="login-subtitle">Welcome Back! Please Login To Your Account</p>

                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                className="form-input"
                                type="email" 
                                value={user_email} 
                                onChange={e => set_user_email(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input 
                                className="form-input"
                                type="password" 
                                value={user_password} 
                                onChange={e => set_user_password(e.target.value)} 
                                required 
                            />
                        </div>

                        {/* UI Заглушки (виглядає дорого, як просив Остап) */}
                        <div className="form-options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <Link to="#" className="forgot-link">Forget Password?</Link>
                        </div>
                        
                        <button 
                            className="btn-submit"
                            type="submit" 
                            disabled={is_loading}
                        >
                            {is_loading ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Помилка виводиться через клас, а не інлайн-стилем */}
                        {error_message && (
                            <div className="error-text">{error_message}</div>
                        )}

                        <div className="register-link">
                            Don't Have An Account? <Link to="/register">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;