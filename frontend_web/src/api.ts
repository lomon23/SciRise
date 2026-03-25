import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});


let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

      
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

          
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post('/refresh/', {}, { withCredentials: true });
                const newAccessToken = response.data.access;

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              
                processQueue(null, newAccessToken);
                
                return api(originalRequest);
            }  catch (refreshError) {
    
           processQueue(refreshError, null);
    
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