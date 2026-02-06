// Hapus import React jika tidak digunakan di versi React terbaru
import { useNotificationStore, Notification } from '../store/notificationStore';
import BackButton from '../components/BackButton';
import { BellOff } from 'lucide-react';

export default function NotificationPage() {
    const { notifications, markAsRead } = useNotificationStore();
    // warnaSatuan dihapus karena tidak dipakai (menghilangkan warning)

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pt-24">
            <BackButton to="/" />
            <h1 className="text-2xl font-black mt-4 mb-6">Notifikasi</h1>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <BellOff size={48} className="mb-4 opacity-20" />
                    <p>Belum ada notifikasi baru</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Tambahkan tipe Notification pada parameter n */}
                    {notifications.map((n: Notification) => (
                        <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${n.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100 shadow-sm'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold ${n.isRead ? 'text-gray-600' : 'text-blue-900'}`}>
                                    {n.title}
                                </h3>
                                {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shadow-sm" />}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-3 block font-medium">
                                {new Date(n.timestamp).toLocaleString('id-ID')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}