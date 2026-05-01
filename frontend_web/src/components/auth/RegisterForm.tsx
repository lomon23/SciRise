import './LoginForm.css'; // Підключаємо нашу готову красу
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api';

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    const [user_email, set_user_email] = useState('');
    const [user_username, set_user_username] = useState('');
    const [user_password, set_user_password] = useState('');
    const navigate = useNavigate();

    // Логіка відправки даних залишається повністю без змін
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('register/', {
                email: user_email,
                username: user_username,
                password: user_password
            });
            if (response.status === 201) navigate('/login');
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                set_validation_errors(error.response.data);
            }
        }
    };

    return (
        <div className="auth-page-container">
            
            {/* 1. Форма тепер ЗЛІВА */}
            <div className="auth-form-area">
                <div className="auth-form-wrapper">
                    
                    <h2 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: '600' }}>Register</h2>
                    <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '35px' }}>
                        Welcome! Please create your account.
                    </p>

                    <form onSubmit={handleRegisterSubmit}>
                        
                        <p style={{ fontSize: '12px', marginBottom: '8px', color: '#6c757d' }}>Email Address</p>
                        <input 
                            type="email" 
                            value={user_email} 
                            onChange={e => set_user_email(e.target.value)} 
                            className="custom-input" 
                            required 
                        />
                        {/* Якщо є помилка пошти, показуємо її тут */}
                        {validation_errors.email && (
                            <p style={{ color: 'red', fontSize: '13px', marginTop: '-15px', marginBottom: '15px' }}>
                                {validation_errors.email[0]}
                            </p>
                        )}

                        <p style={{ fontSize: '12px', marginBottom: '8px', color: '#6c757d' }}>User Name</p>
                        <input 
                            type="text" 
                            value={user_username} 
                            onChange={e => set_user_username(e.target.value)} 
                            className="custom-input" 
                            required 
                        />
                        
                        <p style={{ fontSize: '12px', marginBottom: '8px', color: '#6c757d' }}>Password</p>
                        <input 
                            type="password" 
                            value={user_password} 
                            onChange={e => set_user_password(e.target.value)} 
                            className="custom-input" 
                            required 
                        />
                        
                        <button type="submit" className="custom-button">Register</button>
                    </form>

                    {/* Посилання на логін */}
                    <div style={{ marginTop: '25px', fontSize: '12px', color: '#6c757d' }}>
                        Already Have An Account? <Link to="/login" className="auth-link" style={{color: '#6b4eb0', fontWeight: 'bold', textDecoration: 'none'}}>Log In</Link>
                    </div>

                </div>
            </div>

            {/* 2. Сірий квадрат тепер СПРАВА */}
            <div className="auth-image-placeholder"></div>
            
        </div>
    );
};

export default RegisterForm;