import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import api from "../../shared/api/api";
import './LoginForm.css';
import './RegisterForm.css';
import Button from '../../shared/ui/button/Button';

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    
    const [first_name, set_first_name] = useState<string>('');
    const [last_name, set_last_name] = useState<string>('');
    const [user_email, set_user_email] = useState<string>('');
    const [user_password, set_user_password] = useState<string>('');
    const [confirm_password, set_confirm_password] = useState<string>('');
    
    const [local_error, set_local_error] = useState<string>('');
    
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        set_local_error('');
        set_validation_errors({});

       
        if (user_password !== confirm_password) {
            set_local_error('Паролі не співпадають!');
            return;
        }

        try {
            const response = await api.post('register/', {
                email: user_email,
                username: `${first_name}_${last_name}`.toLowerCase(),
                password: user_password,
                first_name: first_name,
                last_name: last_name
            });

            if (response.status === 201) {
                console.log('Користувача створено!');
                navigate('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axios_error = error as AxiosError<Record<string, string[]>>;
                if (axios_error.response && axios_error.response.status === 400) {
                    set_validation_errors(axios_error.response.data);
                } else {
                    console.error('Системна помилка API:', axios_error.message);
                    set_local_error('Помилка сервера. Спробуйте пізніше.');
                }
            } else {
                console.error('Невідома помилка:', error);
            }
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleRegisterSubmit} className="auth-form">
                
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">First Name</label>
                        <input
                            type="text"
                            className="custom-input"
                            value={first_name}
                            onChange={(e) => set_first_name(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Last Name</label>
                        <input
                            type="text"
                            className="custom-input"
                            value={last_name}
                            onChange={(e) => set_last_name(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        className="custom-input"
                        value={user_email}
                        onChange={(e) => set_user_email(e.target.value)}
                        required
                    />
                    {validation_errors.email && (
                        <span className="error-text">{validation_errors.email[0]}</span>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        className="custom-input"
                        value={user_password}
                        onChange={(e) => set_user_password(e.target.value)}
                        required
                    />
                    {validation_errors.password && (
                        <span className="error-text">{validation_errors.password[0]}</span>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <input
                        type="password"
                        className="custom-input"
                        value={confirm_password}
                        onChange={(e) => set_confirm_password(e.target.value)}
                        required
                    />
                </div>

                {local_error && <p className="error-text">{local_error}</p>}
                
                {validation_errors.username && (
                     <p className="error-text">Помилка імені: {validation_errors.username[0]}</p>
                )}

                <Button type="submit">Register</Button>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Вже маєте акаунт?{' '}
                    <span 
                        onClick={() => navigate('/login')} 
                        style={{ color: '#6347D1', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Увійти
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;