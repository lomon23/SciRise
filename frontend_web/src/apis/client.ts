import axios from 'axios';
import { use_auth_store } from '../store/authStore';

// Переконайся, що тут є слово export перед const!
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/auth/';

export const api_client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Додаємо токен до кожного запиту
api_client.interceptors.request.use((config) => {
    const token = use_auth_store.getState().access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Рефреш токена при 401 помилці
api_client.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Використовуємо BASE_URL прямо, щоб уникнути циклу в інтерцепторі
                const resp = await axios.post(`${BASE_URL}refresh/`, {}, { withCredentials: true });
                const token = resp.data.access;
                
                use_auth_store.getState().set_access_token(token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                
                return api_client(originalRequest);
            } catch (reErr) {
                use_auth_store.getState().clear_access_token();
                window.location.href = '/login';
                return Promise.reject(reErr);
            }
        }
        return Promise.reject(err);
    }
);