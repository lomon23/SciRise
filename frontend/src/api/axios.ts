import axios from 'axios';
const baseURL = 'http://127.0.0.1:8000/api/';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Інтерцептор для додавання токену
axiosInstance.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const { access } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ТУТ БУДЕ ІНТЕРЦЕПТОР ДЛЯ РЕФРЕШУ ТОКЕНА (додамо трохи пізніше, коли база запрацює)