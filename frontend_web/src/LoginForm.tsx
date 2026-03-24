import React, { useState } from 'react';
import api from './api';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

const styles: { [key: string]: React.CSSProperties } = {
    CardContainer: { backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', maxWidth: '350px', width: '100%', margin: '50px auto', fontFamily: 'sans-serif' },
    Header: { textAlign: 'center', color: '#1a1a1a' },
    Form: { display: 'flex', flexDirection: 'column' },
    Label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: 'bold' },
    Input: { width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#F5F5F5', color: '#1a1a1a', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '15px' },
    SubmitButton: { padding: '12px', cursor: 'pointer', backgroundColor: '#00D1B2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', width: '100%' }
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [user_email, set_user_email] = useState<string>('');
    const [user_password, set_user_password] = useState<string>('');

    const [error_message, set_error_message] = useState<string>('');
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('/login/', {
                email: user_email,
                password: user_password
            });

            if (response.status === 200) {
                
                onLoginSuccess(response.data.access);
            
            }
        } catch (error: any) {
            console.error('Помилка:', error.response?.data || error.message);
            set_error_message('Помилка авторизації. Перевірте пошту або пароль.');
        }
   
    };
    

    return (
        <div style={styles.CardContainer}>
            <h2 style={styles.Header}>Авторизація</h2>
            
            <form onSubmit={handleLoginSubmit} style={styles.Form}>
                <div>
                    <label style={styles.Label}>Email Address</label>
                    <input
                        type="email"
                        value={user_email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_user_email(e.target.value)}
                        required
                        style={styles.Input}
                        placeholder="email@gmail.com"
                    />
                </div>

                <div>
                    <label style={styles.Label}>Password</label>
                    <input
                        type="password"
                        value={user_password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_user_password(e.target.value)}
                        required
                        style={styles.Input}
                        placeholder="••••••••"
                    />
                </div>
                 
                {error_message && <p style={{ color: 'red' }}>{error_message}</p>}
                
                <button type="submit" style={styles.SubmitButton}>
                    Увійти
                </button>
            </form>
        </div>
    );
};

export default LoginForm;