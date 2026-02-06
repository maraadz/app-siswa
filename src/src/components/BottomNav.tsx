import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  HomeIcon,
  HelpCircleIcon,
  FolderIcon,
  FileTextIcon,
  DollarSignIcon
} from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { warnaSatuan } = useAuthStore(); // Ambil warna dari Store

  const navItems = [
    {
      icon: HelpCircleIcon,
      label: 'Bantuan',
      path: '/bantuan'
    },
    {
      icon: FolderIcon,
      label: 'Portofolio',
      path: '/portofolio'
    },
    {
      icon: HomeIcon,
      label: 'Home',
      path: '/',
      isCenter: true
    },
    {
      icon: FileTextIcon,
      label: 'Rapor',
      path: '/rapor'
    },
    {
      icon: DollarSignIcon,
      label: 'Keuangan',
      path: '/keuangan',
      isExternal: true
    }
  ];

  const handleNavClick = (path: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open('https://psp.teknologikartu.com/login', '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-[1000] pb-safe">
      <div className="flex items-end justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          // LOGIKA TOMBOL TENGAH (HOME)
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="flex flex-col items-center justify-center -mt-8 relative"
              >
                {/* Lingkaran Luar untuk Efek Mengambang */}
                <div
                  className="p-4 rounded-2xl shadow-xl transition-all active:scale-90"
                  style={{
                    backgroundColor: warnaSatuan,
                    boxShadow: `0 8px 20px -6px ${warnaSatuan}AA`
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span
                  className="text-[10px] font-bold mt-2 uppercase tracking-wider"
                  style={{ color: isActive ? warnaSatuan : '#64748b' }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          // LOGIKA TOMBOL BIASA
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path, item.isExternal)}
              className="flex flex-col items-center gap-1.5 px-3 py-1 relative group transition-all"
            >
              {/* Indikator Garis Atas Modern */}
              {isActive && (
                <div
                  className="absolute -top-3 w-6 h-1 rounded-full animate-pulse"
                  style={{ backgroundColor: warnaSatuan }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                style={{ color: isActive ? warnaSatuan : '#94a3b8' }}
              />

              <span
                className={`text-[10px] font-bold transition-colors ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600'}`}
                style={{ color: isActive ? warnaSatuan : '' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}