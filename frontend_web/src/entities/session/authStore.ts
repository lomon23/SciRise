import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 

interface AuthState {
    access_token: string | null;
    set_access_token: (token: string) => void;
    clear_access_token: () => void;
}

export const use_auth_store = create<AuthState>()(
    persist(
        (set) => ({
            access_token: null,
            set_access_token: (token) => set({ access_token: token }),
            clear_access_token: () => set({ access_token: null }),
        }),
        {
            name: 'scirise-auth-storage',
        }
    )
);