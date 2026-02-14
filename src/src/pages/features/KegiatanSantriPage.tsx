import BackButton from '../../components/BackButton';
import { Clock } from 'lucide-react';

export default function KegiatanSantriPage() {
    const agenda = [
        { jam: '03:30 - 04:30', kegiatan: 'Qiyamul Lail & Shalat Subuh', desc: 'Masjid Al-Qalam' },
        { jam: '05:00 - 06:00', kegiatan: 'Halaqah Quran Pagi', desc: 'Asrama masing-masing' },
        { jam: '18:30 - 19:30', kegiatan: 'Kajian Kitab/Muthalaah', desc: 'Aula Mahad' },
        { jam: '20:00 - 21:30', kegiatan: 'Belajar Mandiri (Night Study)', desc: 'Gedung Sekolah' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <BackButton to="/features/kepengasuhan" />
            <div className="mb-8 mt-4">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Kegiatan Santri</h1>
                <p className="text-sm text-gray-500 font-medium">Agenda harian dan pembiasaan di Mahad</p>
            </div>

            <div className="space-y-4">
                {agenda.map((item, i) => (
                    <div key={i} className="flex gap-4 bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm items-start">
                        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.jam}</p>
                            <h3 className="font-bold text-gray-800 text-sm mt-0.5 uppercase">{item.kegiatan}</h3>
                            <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}