import { create } from 'zustand';

// Kita definisikan tipe datanya supaya tidak muncul error 'any'
export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [
        {
            id: '1',
            title: 'Selamat Datang!',
            message: 'Selamat datang di aplikasi Sabilillah. Cek capaian dimensimu sekarang.',
            timestamp: new Date().toISOString(),
            isRead: false,
        }
    ],
    unreadCount: 1,
    markAsRead: (id) => set((state) => {
        const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
        );
        return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.isRead).length,
        };
    }),
    addNotification: (note) => set((state) => {
        const newNote: Notification = {
            ...note,
            id: Math.random().toString(36).substring(7),
            isRead: false,
            timestamp: new Date().toISOString(),
        };
        return {
            notifications: [newNote, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        };
    }),
}));