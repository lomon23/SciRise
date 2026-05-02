import React, { useState } from 'react';
import api from '../../api';
import { use_auth_store } from '../../store/authStore';
import axios from 'axios';

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
        <form onSubmit={handleLoginSubmit}>
            <h2>Авторизація</h2>
            <input type="email" value={user_email} onChange={e => set_user_email(e.target.value)} placeholder="Email" required />
            <input type="password" value={user_password} onChange={e => set_user_password(e.target.value)} placeholder="Password" required />
            {error_message && <p style={{color: 'red'}}>{error_message}</p>}
            <button type="submit">Увійти</button>
        </form>
    );
};

export default LoginForm;