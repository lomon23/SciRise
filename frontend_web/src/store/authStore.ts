import api from '../api';
import { create } from 'zustand';

interface AuthState {
    access_token: string | null;
    set_access_token: (token: string) => void;
    clear_access_token: () => void;
    logout: () => Promise<void>;
}

export const use_auth_store = create<AuthState>()((set) => ({
    access_token: null,
    set_access_token: (token) => set({ access_token: token }),
    clear_access_token: () => set({ access_token: null }),
    logout: async () => {
        try {
            await api.post('/logout/', {});
        } catch (error) {
            console.error("Помилка при виході:", error);
        } finally {
            set({ access_token: null });
            window.location.href = '/login';
        }
    },
}));