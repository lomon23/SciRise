import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api';

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    const [user_email, set_user_email] = useState('');
    const [user_username, set_user_username] = useState('');
    const [user_password, set_user_password] = useState('');
    const navigate = useNavigate();

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
        <form onSubmit={handleRegisterSubmit}>
            <h2>Реєстрація</h2>
            <input type="email" value={user_email} onChange={e => set_user_email(e.target.value)} placeholder="Email" required />
            {validation_errors.email && <span style={{color: 'red'}}>{validation_errors.email[0]}</span>}
            
            <input type="text" value={user_username} onChange={e => set_user_username(e.target.value)} placeholder="Username" required />
            
            <input type="password" value={user_password} onChange={e => set_user_password(e.target.value)} placeholder="Password" required />
            
            <button type="submit">Створити аккаунт</button>
        </form>
    );
};

export default RegisterForm;