import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import useSound from 'use-sound';

export default function NotificationHandler() {
    // Gunakan suara notifikasi (Bisa diganti file lokal di /public/sounds/notif.mp3)
    const [playNotify] = useSound('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', {
        volume: 0.7
    });

    const { notifications } = useNotificationStore();

    useEffect(() => {
        const latestNotif = notifications[0];

        // Cek jika ada notif baru dan belum dibaca
        if (latestNotif && !latestNotif.isRead) {
            const now = new Date().getTime();
            const notifTime = new Date(latestNotif.timestamp).getTime();

            // Hanya bunyi jika notif masuk dalam 3 detik terakhir (mencegah bunyi berulang saat refresh)
            if (now - notifTime < 3000) {
                // 1. Bunyikan Suara
                playNotify();

                // 2. Munculkan Notifikasi Sistem (untuk Android/iOS/Web Browser)
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification(latestNotif.title, {
                        body: latestNotif.message,
                        icon: '/assets/icon/favicon.png', // sesuaikan icon
                    });
                }

                // 3. Getar HP (Android)
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
            }
        }
    }, [notifications, playNotify]);

    return null; // Komponen invisible
}