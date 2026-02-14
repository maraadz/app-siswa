import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import api from '../api/axios';
import axios from 'axios';
import { useFilterStore } from './filterStore';

interface AuthState {
    accessToken: string | null;
    user: any | null;
    warnaSatuan: string;
    isAuthenticated: boolean;
    isInitializing: boolean;
    isLoading: boolean;
    setLoading: (status: boolean) => void;
    setAuth: (token: string, user: any) => void;
    setToken: (token: string) => void;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    warnaSatuan: localStorage.getItem('warna_satuan') || '#08543d',
    isAuthenticated: !!localStorage.getItem('is_logged_in'),
    isInitializing: true,
    isLoading: false,

    setLoading: (status) => set({ isLoading: status }),

    setAuth: (token, user) => {
        const id = parseInt(user.idsatuan || user.IDSATUAN);
        let warna = '#08543d';
        if ([2, 7].includes(id)) warna = '#AE4B84';
        else if ([3, 8].includes(id)) warna = '#AFCB1F';
        else if (id === 4) warna = '#EF7F1B';
        else if (id === 5) warna = '#979DA5';

        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('warna_satuan', warna);
        localStorage.setItem('is_logged_in', 'true');

        document.documentElement.style.setProperty('--warna-satuan', warna);
        document.documentElement.style.setProperty('--ion-color-primary', warna);

        useFilterStore.getState().initializeFilter(user);

        set({
            accessToken: token,
            user,
            warnaSatuan: warna,
            isAuthenticated: true,
            isInitializing: false
        });
    },

    setToken: (token) => set({ accessToken: token }),

    logout: async () => {
        try {
            const isMobile = window.hasOwnProperty('Capacitor');
            let payload = {};
            if (isMobile) {
                const { value } = await Preferences.get({ key: 'refresh_token' });
                payload = { refresh_token: value };
            }
            await api.post('/api/auth/logout', payload);
        } catch (e) {
            console.log("Logout cleanup");
        } finally {
            // JANGAN gunakan localStorage.clear() karena akan menghapus notifikasi
            localStorage.removeItem('user_data');
            localStorage.removeItem('is_logged_in');
            localStorage.removeItem('warna_satuan');

            await Preferences.clear();

            set({
                accessToken: null,
                user: null,
                warnaSatuan: '#08543d',
                isAuthenticated: false
            });

            // Gunakan replace agar history tidak berantakan saat klik back
            window.location.replace('/login');
        }
    },

    initialize: async () => {
        if (!localStorage.getItem('is_logged_in')) {
            set({ isInitializing: false, isAuthenticated: false });
            return;
        }

        const savedUser = JSON.parse(localStorage.getItem('user_data') || 'null');
        if (savedUser) {
            useFilterStore.getState().initializeFilter(savedUser);
            // Re-apply warna agar UI tidak rusak/putih saat reload
            const savedWarna = localStorage.getItem('warna_satuan') || '#08543d';
            document.documentElement.style.setProperty('--warna-satuan', savedWarna);
        }

        try {
            const isMobile = window.hasOwnProperty('Capacitor');
            let payload = {};

            if (isMobile) {
                const { value } = await Preferences.get({ key: 'refresh_token' });
                if (!value) throw new Error("No RF");
                payload = { refresh_token: value };
            }

            const res = await axios.post(
                (import.meta as any).env.DEV ? '/api-sima/api/auth/refresh' : 'https://apps.sekolahsabilillah.sch.id/api/auth/refresh',
                payload,
                { withCredentials: true }
            );

            if (res.data.status === 'ok') {
                const userData = res.data.user;
                if (userData) useFilterStore.getState().initializeFilter(userData);

                set({
                    accessToken: res.data.access_token,
                    user: userData || get().user,
                    isInitializing: false,
                    isAuthenticated: true
                });
            } else {
                get().logout();
            }
        } catch (e: any) {
            if (!e.response) {
                set({ isInitializing: false });
            } else {
                get().logout();
            }
        }
    }
}));