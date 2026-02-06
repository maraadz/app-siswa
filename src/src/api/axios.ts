import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Preferences } from '@capacitor/preferences';

const api = axios.create({
    /**
     * SAKLAR OTOMATIS (Environment Variable):
     * - Saat 'npm run dev' (Development): baseURL jadi '/api-sima' (lewat Proxy Vite)
     * - Saat 'npm run build' (Production): baseURL jadi 'https://apps.sekolahsabilillah.sch.id' (Langsung)
     */
    baseURL: (import.meta as any).env.DEV
        ? '/api-sima'
        : 'https://apps.sekolahsabilillah.sch.id',
    //sesuai dokumentasi 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: 10000 // batas waktu tunggu 10 detik
});

// 1. Interceptor Request: Menyisipkan Access Token (Ambil token dari memory)
api.interceptors.request.use((config) => {
    // Jalankan Loading Global (Kecuali route tertentu jika ingin)
    const { setLoading } = useAuthStore.getState();

    // HANYA nyalakan loading untuk request utama
    if (!config.headers?.['x-silent']) {
        setLoading(true);
    }

    const token = useAuthStore.getState().accessToken;

    // Jangan kirim header Auth kalau lagi login/refresh (biar gak kena CORS)
    const isAuthRoute =
        config.url === '/api/auth/login' ||
        config.url === '/api/auth/refresh';
    // bisa pakai ini juga const isAuthRoute = /^\/api\/auth\/(login|refresh)/.test(config.url || '');

    if (token && !isAuthRoute && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // TTL masa berlaku
    }
    return config;
}, (error) => Promise.reject(error));

// 2. Interceptor Response: Handle Error 401 & Auto Refresh Token
api.interceptors.response.use(
    (res) => {
        if (!res.config.headers?.['x-silent']) {
            useAuthStore.getState().setLoading(false);
        }
        return res;
    },
    async (error) => {
        const originalRequest = error.config;

        // 1. CEK: Jika error 401
        // JIKA BUKAN ERROR 401, MATIKAN LOADING SEGERA
        if (error.response?.status !== 401) {
            if (!originalRequest?.headers?.['x-silent']) {
                useAuthStore.getState().setLoading(false);
            }
            return Promise.reject(error);
        }

        // 2. CEK: Jika ini sudah retry ATAU memang asalnya dari endpoint refresh yang gagal
        // Ini adalah logika "Anti-Loop" kamu yang tadi
        if (originalRequest._retry || originalRequest.url?.includes('/api/auth/refresh')) {
            useAuthStore.getState().setLoading(false); // MATIKAN LOADING
            useAuthStore.getState().logout(); // Bersihkan state & storage
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Tandai bahwa request ini sedang mencoba peruntungan kedua (retry)
        originalRequest._retry = true; // anti Loop

        try {
            const isMobile = window.hasOwnProperty('Capacitor');
            let payload = {};

            if (isMobile) {
                const { value } = await Preferences.get({ key: 'refresh_token' });
                if (!value) throw new Error("No RF");
                payload = { refresh_token: value };
            }

            // Gunakan axios instansi baru untuk refresh agar tidak kena interceptor ini lagi
            const res = await axios.post((import.meta as any).env.DEV ? '/api-sima/api/auth/refresh' : 'https://apps.sekolahsabilillah.sch.id/api/auth/refresh', payload, {
                withCredentials: true // digunakan saat memanggil refresh untuk web browser otomatis mengirim HttpOnly Cookie 
            });

            if (res.data.status === 'ok') {
                const newToken = res.data.access_token;
                useAuthStore.getState().setToken(newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Eksekusi ulang request yang tadi sempat gagal
                return api(originalRequest);
            }
        } catch (err) {
            // Jika proses refresh-nya saja sudah gagal (token 30 harinya expired/revoked)
            // MATIKAN LOADING KARENA REFRESH GAGAL TOTAL
            useAuthStore.getState().setLoading(false);
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(err);
        }

        // JIKA SEMUA GAGAL
        useAuthStore.getState().setLoading(false);
        return Promise.reject(error);
    }
);

export default api;