import React, { useState } from 'react';
import api from '../../api';
import { use_auth_store } from '../../store/authStore';
import axios, { AxiosError } from 'axios';



const styles: { [key: string]: React.CSSProperties } = {
    CardContainer: { backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', maxWidth: '350px', width: '100%', margin: '50px auto', fontFamily: 'sans-serif' },
    Header: { textAlign: 'center', color: '#1a1a1a' },
    Form: { display: 'flex', flexDirection: 'column' },
    Label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: 'bold' },
    Input: { width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#F5F5F5', color: '#1a1a1a', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '15px' },
    SubmitButton: { padding: '12px', cursor: 'pointer', backgroundColor: '#00D1B2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', width: '100%' }
};

    const LoginForm: React.FC = () => {
    const set_access_token = use_auth_store((state) => state.set_access_token);
    const [user_email, set_user_email] = useState<string>('');
    const [user_password, set_user_password] = useState<string>('');

    const [error_message, set_error_message] = useState<string>('');
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
        }  catch (error) {
    if (axios.isAxiosError(error)) { 
        const axios_error = error as AxiosError<{ detail?: string }> 
        
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
}   };
    

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
                        placeholder="user@scirise.com"
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