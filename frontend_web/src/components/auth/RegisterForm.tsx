import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { AuthService } from '../../apis/authService';
import './RegisterForm.css'; // Обов'язковий імпорт стилів

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    
    // Стейти полів
    const [user_first_name, set_user_first_name] = useState('');
    const [user_last_name, set_user_last_name] = useState('');
    const [user_email, set_user_email] = useState('');
    const [user_username, set_user_username] = useState('');
    const [user_password, set_user_password] = useState('');
    
    const [is_loading, set_is_loading] = useState(false);
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        set_validation_errors({});
        set_is_loading(true);

        try {
            // TODO: Коли Міша оновить бекенд, сюди треба буде додати first_name та last_name
            const response = await AuthService.register({
                email: user_email,
                username: user_username,
                password: user_password
            });

            if (response.status === 201) {
                // TODO: Пізніше змінимо редірект на сторінку /onboarding
                navigate('/login');
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                set_validation_errors(error.response.data);
            } else {
                console.error("Unknown registration error:", error);
            }
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-form-box">
                    <h2 className="register-title">Register</h2>
                    <p className="register-subtitle">Welcome! Please create your account.</p>

                    <form onSubmit={handleRegisterSubmit}>
                        
                        {/* Нові поля: Ім'я та Прізвище (Заглушки) */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input 
                                    className="form-input"
                                    type="text" 
                                    value={user_first_name} 
                                    onChange={e => set_user_first_name(e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input 
                                    className="form-input"
                                    type="text" 
                                    value={user_last_name} 
                                    onChange={e => set_user_last_name(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                className="form-input"
                                type="email" 
                                value={user_email} 
                                onChange={e => set_user_email(e.target.value)} 
                                required 
                            />
                            {validation_errors.email && (
                                <span className="error-text">{validation_errors.email[0]}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">User Name</label>
                            <input 
                                className="form-input"
                                type="text" 
                                value={user_username} 
                                onChange={e => set_user_username(e.target.value)} 
                                required 
                            />
                            {validation_errors.username && (
                                <span className="error-text">{validation_errors.username[0]}</span>
                            )}
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
                            {validation_errors.password && (
                                <span className="error-text">{validation_errors.password[0]}</span>
                            )}
                        </div>
                        
                        <button 
                            className="btn-submit"
                            type="submit" 
                            disabled={is_loading}
                        >
                            {is_loading ? 'Registering...' : 'Register'}
                        </button>

                        <div className="login-link">
                            Already Have An Account? <Link to="/login">Log In</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Сіра заглушка справа */}
            <div className="register-image"></div>
        </div>
    );
};

export default RegisterForm;