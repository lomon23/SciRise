import React, { useState } from 'react';
import api from "../../shared/api/api";
import { use_auth_store } from "../../entities/session/authStore";
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import Button from '../../shared/ui/button/Button';

const LoginForm: React.FC = () => {
    const set_access_token = use_auth_store((state) => state.set_access_token);
    const [user_email, set_user_email] = useState<string>('');
    const [user_password, set_user_password] = useState<string>('');
    const [error_message, set_error_message] = useState<string>('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('login/', {
                email: user_email,
                password: user_password
            });

            if (response.status === 200) {
                set_access_token(response.data.access);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axios_error = error as AxiosError<{ detail?: string }>;
                if (axios_error.response) {
                    if (axios_error.response.status === 401) {
                        set_error_message(axios_error.response.data?.detail || 'Неправильний логін або пароль');
                    } else {
                        set_error_message(`Помилка сервера: ${axios_error.response.status}`);
                    }
                } else {
                    set_error_message('Немає зв\'язку з сервером. Перевірте підключення.');
                }
            } else {
                set_error_message('Сталася непередбачувана помилка');
                console.error(error);
            }
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        className="custom-input"
                        value={user_email}
                        onChange={(e) => set_user_email(e.target.value)}
                        required
                        placeholder="user@scirise.com"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        className="custom-input"
                        value={user_password}
                        onChange={(e) => set_user_password(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>

                {error_message && <p className="error-text">{error_message}</p>}

                <Button type="submit">Увійти</Button>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Немає акаунту?{' '}
                    <span 
                        onClick={() => navigate('/register')} 
                        style={{ color: '#6347D1', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Зареєструватися
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;