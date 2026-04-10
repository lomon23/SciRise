import axios from 'axios';
import { use_auth_store } from "../../entities/session/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Додаємо токен до кожного запиту
api.interceptors.request.use((config) => {
    const token = use_auth_store.getState().access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // ВАЖЛИВО: Використовуй axios, а не api для рефрешу, щоб уникнути циклу
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh/`, {}, { withCredentials: true });
                const new_token = response.data.access;

                // Оновлюємо токен у Zustand
                use_auth_store.getState().set_access_token(new_token);

                processQueue(null, new_token);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                use_auth_store.getState().clear_access_token();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;