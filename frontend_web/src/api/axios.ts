import axios from 'axios';

// Створюємо базовий інстанс для всіх запитів
export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Переконайся, що порт і префікс правильні
  headers: {
    'Content-Type': 'application/json',
  },
});

// Хелпер для витягування токенів
const getTokens = () => {
  const tokensString = localStorage.getItem('tokens');
  if (tokensString) {
    try {
      return JSON.parse(tokensString);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 1. REQUEST INTERCEPTOR: Чіпляємо access-токен до кожного запиту
axiosInstance.interceptors.request.use(
  (config) => {
    const tokens = getTokens();
    if (tokens?.access && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Відловлюємо 401 і робимо рефреш
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Якщо отримали 401 (Unauthorized) і ми ще не пробували його оновити
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Блокуємо зациклення
      const tokens = getTokens();

      if (tokens?.refresh) {
        try {
          // Робимо запит новим незалежним axios, щоб не зациклити інтерсептор
          const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
            refresh: tokens.refresh
          });

          // Оновлюємо токени. Якщо бекенд видав і новий refresh - беремо його, якщо ні - лишаємо старий
          const newTokens = {
            access: response.data.access,
            refresh: response.data.refresh || tokens.refresh 
          };
          localStorage.setItem('tokens', JSON.stringify(newTokens));

          // Міняємо хедер в оригінальному запиті і повторюємо його
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          // Якщо рефреш токен теж протух (наприклад, пройшов тиждень) — примусово розлогінюємо
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          window.location.href = '/login'; // Викидаємо на сторінку логіну
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);