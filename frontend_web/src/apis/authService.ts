import { api_client } from './client';

// МАЄ БУТИ САМЕ ТАК: export const AuthService
export const AuthService = {
    login: async (credentials: any) => {
        return api_client.post('login/', credentials);
    },
    register: async (userData: any) => {
        return api_client.post('register/', userData);
    },
    logout: async () => {
        return api_client.post('logout/');
    }
};