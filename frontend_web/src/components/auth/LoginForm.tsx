import './LoginForm.css';
import React, { useState } from 'react';
import api from '../../api';
import { use_auth_store } from '../../store/authStore';

const LoginForm = () => {
    const set_access_token = use_auth_store((state) => state.set_access_token);
    const [user_email, set_user_email] = useState('');
    const [user_password, set_user_password] = useState('');
    const [error_message, set_error_message] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('login/', { email: user_email, password: user_password });
            if (response.status === 200) {
                set_access_token(response.data.access);
            }
        } catch (error: any) {
            set_error_message(error.response?.data?.detail || 'Помилка авторизації');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-image-placeholder"></div>

            <div className="auth-form-area">
                {/* Нова обгортка для обмеження ширини */}
                <div className="auth-form-wrapper">
                    
                    <h2 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: '600' }}>Login</h2>
                    <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '35px' }}>
                        Welcome Back! Please Login To Your Account
                    </p>

                    <form onSubmit={handleLoginSubmit}>
                        
                        <p style={{ fontSize: '12px', marginBottom: '8px', color: '#6c757d' }}>User Name</p>
                        <input 
                            type="email" 
                            value={user_email} 
                            onChange={e => set_user_email(e.target.value)} 
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

                        <div className="auth-options">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ width: '16px', height: '16px', accentColor: '#6b4eb0', cursor: 'pointer' }} 
                                />
                                Remember me
                            </label>
                            <span className="auth-link">Forget Password?</span>
                        </div>
                        
                        {error_message && <p style={{color: 'red', fontSize: '14px'}}>{error_message}</p>}
                        
                        <button type="submit" className="custom-button">Login</button>
                    </form>

                    <div style={{ marginTop: '25px', fontSize: '12px', color: '#6c757d' }}>
                        Don't Have An Account? <span className="auth-link" style={{color: '#6b4eb0', fontWeight: 'bold'}}>Sign Up</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginForm;