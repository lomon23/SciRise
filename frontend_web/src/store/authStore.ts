import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    access_token: string | null;
    // Стан завантаження або ініціалізації (корисно для роутингу)
    is_authenticated: boolean;
    
    // Екшени
    set_access_token: (token: string) => void;
    clear_access_token: () => void;
}

export const use_auth_store = create<AuthState>()(
    persist(
        (set) => ({
            access_token: null,
            is_authenticated: false,

            set_access_token: (token: string) => set({ 
                access_token: token, 
                is_authenticated: true 
            }),

            clear_access_token: () => set({ 
                access_token: null, 
                is_authenticated: false 
            }),
        }),
        {
            name: 'scirise-auth-storage', // Ключ у localStorage
            storage: createJSONStorage(() => localStorage), // Використовуємо стандартний localStorage
        }
    )
);