import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type?: 'info' | 'success' | 'update';
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [],
            unreadCount: 0,

            markAsRead: (id) => set((state) => {
                const updated = state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                );
                return {
                    notifications: updated,
                    unreadCount: updated.filter((n) => !n.isRead).length,
                };
            }),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            })),

            addNotification: (note) => set((state) => {
                // Getar HP jika mendukung (Android/Chrome)
                if (typeof window !== 'undefined' && window.navigator.vibrate) {
                    window.navigator.vibrate([100, 50, 100]);
                }

                const newNote: Notification = {
                    ...note,
                    id: Math.random().toString(36).substring(7),
                    isRead: false,
                    timestamp: new Date().toISOString(),
                };

                const updatedNotifications = [newNote, ...state.notifications].slice(0, 50); // Limit 50 notif biar gak berat

                return {
                    notifications: updatedNotifications,
                    unreadCount: updatedNotifications.filter(n => !n.isRead).length,
                };
            }),

            clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'sabilillah-notification-storage', // Nama key di LocalStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);