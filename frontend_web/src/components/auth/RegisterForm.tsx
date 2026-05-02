import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { AuthService } from '../../apis/authService';

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    const [user_email, set_user_email] = useState('');
    const [user_username, set_user_username] = useState('');
    const [user_password, set_user_password] = useState('');
    const [is_loading, set_is_loading] = useState(false);
    
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Очищуємо помилки перед спробою
        set_validation_errors({});
        set_is_loading(true);

        try {
            const response = await AuthService.register({
                email: user_email,
                username: user_username,
                password: user_password
            });

            // Якщо статус 201 Created — все чітко
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error: any) {
            // Обробляємо помилки валідації від Django (400 Bad Request)
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
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <h2>Реєстрація</h2>
            
            <input 
                type="email" 
                value={user_email} 
                onChange={e => set_user_email(e.target.value)} 
                placeholder="Email" 
                required 
            />
            {validation_errors.email && (
                <span style={{ color: '#ff3860', fontSize: '0.8rem' }}>{validation_errors.email[0]}</span>
            )}
            
            <input 
                type="text" 
                value={user_username} 
                onChange={e => set_user_username(e.target.value)} 
                placeholder="Username" 
                required 
            />
            {validation_errors.username && (
                <span style={{ color: '#ff3860', fontSize: '0.8rem' }}>{validation_errors.username[0]}</span>
            )}
            
            <input 
                type="password" 
                value={user_password} 
                onChange={e => set_user_password(e.target.value)} 
                placeholder="Password" 
                required 
            />
            {validation_errors.password && (
                <span style={{ color: '#ff3860', fontSize: '0.8rem' }}>{validation_errors.password[0]}</span>
            )}
            
            <button 
                type="submit" 
                disabled={is_loading}
                style={{ 
                    padding: '10px', 
                    background: is_loading ? '#444' : '#00D1B2', 
                    color: '#fff', 
                    border: 'none', 
                    cursor: is_loading ? 'not-allowed' : 'pointer' 
                }}
            >
                {is_loading ? 'Створення...' : 'Створити аккаунт'}
            </button>
        </form>
    );
};

export default RegisterForm;