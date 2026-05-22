import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Інтерцептор запитів (додає access токен)
axiosInstance.interceptors.request.use(
    (config) => {
        const tokensString = localStorage.getItem('tokens');
        if (tokensString) {
            const tokens = JSON.parse(tokensString);
            if (tokens?.access) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Інтерцептор відповідей (ловить 401 і робить автоматичний рефреш)
axiosInstance.interceptors.response.use(
    (response) => response, // Якщо все ок - просто пропускаємо
    async (error) => {
        const originalRequest = error.config;

        // Якщо зловили 401 і це ще не була спроба рефрешу (запобіжник від нескінченного циклу)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokensString = localStorage.getItem('tokens');
                if (!tokensString) throw new Error('No tokens in storage');
                
                const { refresh } = JSON.parse(tokensString);
                if (!refresh) throw new Error('No refresh token');

                // Робимо запит за новим токеном. 
                // ВАЖЛИВО: використовуємо звичайний axios, а не axiosInstance, щоб не зациклити інтерцептори
                const response = await axios.post(`${baseURL}auth/refresh/`, {
                    refresh: refresh
                });

                // Отримали новий access, зберігаємо назад у localStorage
                const newAccess = response.data.access;
                const newTokens = JSON.stringify({ access: newAccess, refresh: refresh });
                localStorage.setItem('tokens', newTokens);

                // Оновлюємо заголовок в оригінальному запиті і повторюємо його
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                // Якщо рефреш не вдався (токен невалідний або протух) — викидаємо з акаунта
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/auth/login'; // Жорсткий редірект на логін
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);