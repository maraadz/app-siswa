import { useNotificationStore, Notification } from '../store/notificationStore';
import BackButton from '../components/BackButton';
import { BellOff, CheckCheck, Trash2, Volume2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function NotificationPage() {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
    const { warnaSatuan } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-2xl mx-auto px-4 py-6 pt-24">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <BackButton to="/" />
                        <h1 className="text-2xl font-black text-gray-900">Notifikasi</h1>
                    </div>

                    {notifications.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={markAllAsRead}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Tandai semua dibaca"
                            >
                                <CheckCheck size={20} />
                            </button>
                            <button
                                onClick={clearNotifications}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Hapus semua"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Banner Edukasi Suara (Hanya muncul jika ada notif) */}
                {notifications.length > 0 && (
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                        <Volume2 className="text-amber-600 shrink-0" size={18} />
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                            <b>Tips:</b> Agar suara notifikasi muncul otomatis, pastikan Anda telah berinteraksi (klik/tap) di halaman ini minimal satu kali.
                        </p>
                    </div>
                )}

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BellOff size={32} className="opacity-20" />
                        </div>
                        <p className="font-bold">Zonkkk!</p>
                        <p className="text-sm">Belum ada info baru untukmu saat ini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n: Notification) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${n.isRead
                                    ? 'bg-white border-gray-100 opacity-75'
                                    : 'bg-white border-l-4 shadow-md'
                                    }`}
                                style={{ borderLeftColor: n.isRead ? '#F1F5F9' : warnaSatuan }}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold transition-colors ${n.isRead ? 'text-gray-500' : 'text-gray-900'}`}>
                                        {n.title}
                                    </h3>
                                    {!n.isRead && (
                                        <div
                                            className="w-2.5 h-2.5 rounded-full animate-pulse"
                                            style={{ backgroundColor: warnaSatuan }}
                                        />
                                    )}
                                </div>
                                <p className={`text-sm leading-relaxed ${n.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {n.message}
                                </p>
                                <div className="flex items-center gap-2 mt-4">
                                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                                        {new Date(n.timestamp).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}