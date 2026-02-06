import { useNavigate } from 'react-router-dom';
import { BellIcon, UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore'; // Tambah ini
import type { StudentData } from '../App';

interface HeaderProps {
  studentData: StudentData;
  onLogout: () => void;
}

export default function Header({ studentData }: HeaderProps) {
  const navigate = useNavigate();
  const { warnaSatuan } = useAuthStore();
  const { unreadCount } = useNotificationStore(); // Ambil jumlah notif belum dibaca

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="px-4 py-3 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Assalamu'alaikum,</p>
            <p className="font-bold text-gray-900 truncate">{studentData.name}</p>
            <p className="text-xs text-gray-500">
              {typeof studentData.kelas === 'object' && studentData.kelas !== null
                ? studentData.kelas.nama_kelas
                : (studentData.kelas || 'Siswa')}
              <span className="mx-1">•</span>
              NIS: {studentData.nis}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/notifications')} // Arahkan ke page notif
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group"
              aria-label="Notifikasi"
            >
              <BellIcon className="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm overflow-hidden"
              style={{ backgroundColor: warnaSatuan }}
              aria-label="Profil"
            >
              {studentData.avatar ? (
                <img src={studentData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}