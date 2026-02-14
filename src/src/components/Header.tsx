import { useNavigate } from 'react-router-dom';
import { BellIcon, UserIcon, Volume2 } from 'lucide-react'; // Tambah Volume2
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import type { StudentData } from '../App';

interface HeaderProps {
  studentData: StudentData;
  onLogout: () => void;
}

export default function Header({ studentData }: HeaderProps) {
  const navigate = useNavigate();
  const { warnaSatuan } = useAuthStore();
  const { unreadCount, addNotification } = useNotificationStore(); // Ambil addNotification untuk simulasi

  // Fungsi untuk memancing izin audio browser di Homepage
  const handleTestSound = () => {
    addNotification({
      title: 'Sistem Suara Aktif',
      message: 'Alhamdulillah, notifikasi suara Sabilillah sudah siap!',
      type: 'success'
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="px-4 py-3 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0"> {/* Tambah min-w-0 agar truncate jalan */}
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Assalamu'alaikum,</p>
            <p className="font-bold text-gray-900 truncate pr-2">{studentData.name}</p>
            <p className="text-[10px] text-gray-500 truncate">
              {typeof studentData.kelas === 'object' && studentData.kelas !== null
                ? studentData.kelas.nama_kelas
                : (studentData.kelas || 'Siswa')}
              <span className="mx-1.5">•</span>
              NIS: {studentData.nis}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2"> {/* Gap lebih rapat di mobile */}

            {/* TOMBOL TES SUARA: Kecil, clean, dan tidak makan tempat */}
            <button
              onClick={handleTestSound}
              className="p-2 hover:bg-gray-50 rounded-lg transition-all group flex flex-col items-center justify-center"
              title="Tes Suara"
            >
              <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-[7px] font-black uppercase text-gray-300 group-hover:text-blue-500 mt-0.5">Tes</span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group"
              aria-label="Notifikasi"
            >
              <BellIcon className="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm overflow-hidden ml-1"
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