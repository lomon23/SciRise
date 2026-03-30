import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

import api from '../../api';


const styles = {
    CardContainer: {
        backgroundColor: '#FFFFFF',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        maxWidth: '350px',
        width: '100%',
        margin: '50px auto',
        fontFamily: 'sans-serif'
    },
    Header: {
        textAlign: 'center' as const,
        marginBottom: '30px',
        color: '#1a1a1a',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px'
    },
    Form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px' 
    },
    Label: {
        display: 'block',
        marginBottom: '6px',
        color: '#555',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    Input: {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box' as const,
        backgroundColor: '#F5F5F5',
        color: '#1a1a1a',
        border: '1px solid #ddd',
        borderRadius: '6px'
    },
    
    SubmitButton: {
        padding: '12px',
        marginTop: '15px',
        cursor: 'pointer',
        backgroundColor: '#00D1B2',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
    }
};

const RegisterForm = () => {
    const [validation_errors, set_validation_errors] = useState<Record<string, string[]>>({});
    const [user_email, set_user_email] = useState<string>('');
    const [user_username, set_user_username] = useState<string>('');
    const [user_password, set_user_password] = useState<string>('');
    const navigate = useNavigate();

   const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  try {
    const response = await api.post('register/', {
      email: user_email,
      username: user_username,
      password: user_password
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
        }
    } else {
        console.error('Невідома помилка:', error);
    }
 }
};
    return (
        <div style={styles.CardContainer}>
            <h2 style={styles.Header}>Реєстрація</h2>
            
            <form onSubmit={handleRegisterSubmit} style={styles.Form}>
                <div>
                    <label style={styles.Label}>Email Address</label>
                    <input
                        type="email"
                        value={user_email}
                        onChange={(e) => set_user_email(e.target.value)}
                        required
                        style={styles.Input}
                        placeholder="user@scirise.com"
                    />
                    {validation_errors.email && (
                     <span style={{ color: 'red', fontSize: '12px' }}>
                     {validation_errors.email?.[0]}
                     </span>
                    )}
                </div>

                <div>
                    <label style={styles.Label}>Username</label>
                    <input
                        type="text"
                        value={user_username}
                        onChange={(e) => set_user_username(e.target.value)}
                        required
                        style={styles.Input}
                        placeholder="Username"
                    />
                    {validation_errors.username && (
                     <span style={{ color: 'red', fontSize: '12px' }}>
                     {validation_errors.username?.[0]}
                     </span>
                    )}
                </div>

                <div>
                    <label style={styles.Label}>Password</label>
                    <input
                        type="password"
                        value={user_password}
                        onChange={(e) => set_user_password(e.target.value)}
                        required
                        style={styles.Input}
                        placeholder="••••••••"
                    />
                    {validation_errors.password && (
                     <span style={{ color: 'red', fontSize: '12px' }}>
                     {validation_errors.password?.[0]}
                     </span>
                    )}
                </div>

                <button type="submit" style={styles.SubmitButton}>
                    Створити аккаунт
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;