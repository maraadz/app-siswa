import { useNavigate } from 'react-router-dom';
import {
    Heart, Star, Stethoscope,
    Users, CalendarDays, ClipboardCheck, ChevronRight
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useAuthStore } from '../../store/authStore';

export default function KepengasuhanPage() {
    const { warnaSatuan } = useAuthStore();
    const navigate = useNavigate();

    const subMenus = [
        { title: 'Tabungan Karakter', desc: 'Poin kedisiplinan & adab', icon: Heart, path: '/features/tabungan-karakter', color: 'bg-rose-50 text-rose-600' },
        { title: 'Tabungan Prestasi', desc: 'Capaian prestasi siswa', icon: Star, path: '/features/prestasi-siswa', color: 'bg-amber-50 text-amber-600' },
        { title: 'Riwayat Kesehatan', desc: 'Catatan medis santri', icon: Stethoscope, path: '/features/riwayat-kesehatan', color: 'bg-blue-50 text-blue-600' },
        { title: 'Riwayat Konseling', desc: 'Bimbingan & konseling', icon: Users, path: '/features/riwayat-konseling', color: 'bg-purple-50 text-purple-600' },
        { title: 'Kegiatan Santri', desc: 'Agenda harian mahad', icon: CalendarDays, path: '/features/kegiatan-santri', color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Perizinan Santri', desc: 'Izin keluar & kepulangan', icon: ClipboardCheck, path: '/features/perizinan-santri', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
            <BackButton to="/" />

            <div className="mb-8 mt-4">
                <h1 className="text-2xl font-black text-gray-900 leading-none">Kepengasuhan</h1>
                <p className="text-gray-500 text-sm mt-2 font-medium">Layanan informasi santri Mahad SMAIS</p>


                {/* Banner Mahad */}
                <div className="mt-8 p-6 rounded-[32px] text-white relative overflow-hidden shadow-lg shadow-gray-200" style={{ backgroundColor: warnaSatuan }}>
                    <div className="relative z-10">
                        <h4 className="font-black text-lg italic tracking-tighter uppercase">Mahad Al-Qalam</h4>
                        <p className="text-[11px] opacity-90 mt-1 max-w-[200px]">Mencetak pemimpin peradaban yang agamis dan berkarakter mulia.</p>
                    </div>
                    <Users className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 rotate-12" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subMenus.map((menu, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(menu.path)}
                        className="flex items-center p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group active:scale-[0.98]"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${menu.color}`}>
                            <menu.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">{menu.title}</h3>
                            <p className="text-[11px] text-gray-400 font-medium leading-tight">{menu.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                    </button>
                ))}
            </div>
        </div>
    );
}