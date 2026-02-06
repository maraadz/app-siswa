import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import api from '../api/axios';
import axios from 'axios';

interface AuthState {
    // ATURAN 9.1: accessToken TIDAK BOLEH ada localStorage.getItem di sini!
    accessToken: string | null;
    user: any | null;
    warnaSatuan: string;
    isAuthenticated: boolean;
    isInitializing: boolean; // Tambahan: status loading awal
    isLoading: boolean;
    setLoading: (status: boolean) => void;
    setAuth: (token: string, user: any) => void;
    setToken: (token: string) => void;
    logout: () => Promise<void>;
    initialize: () => Promise<void>; // Tambahan: fungsi startup
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null, // BERSIH! Token cuma hidup di RAM (Memory)

    // Data non-rahasia boleh di storage biar UI gak kedip pas refresh
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    warnaSatuan: localStorage.getItem('warna_satuan') || '#08543d',
    isAuthenticated: !!localStorage.getItem('is_logged_in'),
    isInitializing: true, // Awalnya true agar App tidak asal tembak API
    isLoading: false, // Default false

    setLoading: (status) => set({ isLoading: status }), // Fungsi pengubah loading

    setAuth: (token, user) => {
        const id = parseInt(user.idsatuan || user.IDSATUAN);

        let warna = '#08543d'; // Default Sabilillah
        if ([2, 7].includes(id)) warna = '#AE4B84';      // TKIS
        else if ([3, 8].includes(id)) warna = '#AFCB1F'; // SDIS
        else if (id === 4) warna = '#EF7F1B';            // SMPIS (Oren)
        else if (id === 5) warna = '#979DA5';            // SMAIS

        // SIMPAN DATA NON-TOKEN (Identitas & Warna)
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('warna_satuan', warna);
        localStorage.setItem('is_logged_in', 'true');

        // Terapkan warna ke sistem
        document.documentElement.style.setProperty('--warna-satuan', warna);
        document.documentElement.style.setProperty('--ion-color-primary', warna);

        // UPDATE STATE: token masuk ke memory (set), bukan localStorage!
        set({
            accessToken: token, // Aman di RAM
            user,
            warnaSatuan: warna,
            isAuthenticated: true,
            isInitializing: false
        });
    },

    setToken: (token) => set({ accessToken: token }), // Update token pas auto-refresh

    // SOLUSI LOGOUT: Panggil API dulu baru hapus lokal
    logout: async () => {
        try {
            const isMobile = window.hasOwnProperty('Capacitor');
            let payload = {};

            if (isMobile) {
                const { value } = await Preferences.get({ key: 'refresh_token' });
                payload = { refresh_token: value };
            }

            // Beritahu server untuk revoke token (asynchronous)
            await api.post('/api/auth/logout', payload);
        } catch (e) {
            console.log("Server session already gone or network error");
        } finally {
            // Tetap hapus data lokal apapun yang terjadi
            localStorage.clear();
            await Preferences.clear();
            set({ accessToken: null, user: null, warnaSatuan: '#08543d', isAuthenticated: false });
            window.location.href = '/login';
        }
    },

    // SOLUSI ANTI-401: Refresh token secara sadar saat aplikasi baru buka
    initialize: async () => {
        // 1. Cek apakah di localstorage statusnya login. Kalau TIDAK, ya ke login.
        if (!localStorage.getItem('is_logged_in')) {
            set({ isInitializing: false, isAuthenticated: false });
            return;
        }

        try {
            const isMobile = window.hasOwnProperty('Capacitor');
            let payload = {};

            if (isMobile) {
                const { value } = await Preferences.get({ key: 'refresh_token' });
                if (!value) throw new Error("No RF");
                payload = { refresh_token: value };
            }

            // 2. Coba ambil token baru
            // Gunakan axios langsung (bukan instance api) untuk menghindari interceptor loop
            const res = await axios.post(
                (import.meta as any).env.DEV ? '/api-sima/api/auth/refresh' : 'https://apps.sekolahsabilillah.sch.id/api/auth/refresh',
                payload,
                { withCredentials: true }
            );

            if (res.data.status === 'ok') {
                set({
                    accessToken: res.data.access_token,
                    isInitializing: false,
                    isAuthenticated: true
                });
            } else {
                // Jika server merespon tapi status bukan ok (misal: token expired)
                get().logout();
            }
        } catch (e: any) {
            console.error("Initialization Error:", e);

            // JIKA ERROR JARINGAN (Bukan 401), jangan logout!
            // Biarkan user masuk, siapa tahu nanti jaringan balik lagi.
            if (!e.response) {
                set({ isInitializing: false });
            } else {
                // JIKA ERROR 401 (Benar-benar ditolak server), baru logout.
                get().logout();
            }
        }
    }
}));