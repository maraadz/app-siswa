import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFilterStore } from '../store/filterStore';

// Import Ikon Custom
import { AgamisIcon } from '../components/icons/AgamisIcon';
import { BerprestasiIcon } from '../components/icons/BerprestasiIcon';
import { MultilingualIcon } from '../components/icons/MultilingualIcon';
import { NegarawanIcon } from '../components/icons/NegarawanIcon';
import { QuraniIcon } from '../components/icons/QuraniIcon';
import { SaintisIcon } from '../components/icons/SaintisIcon';

// Import Components
import Carousel from '../components/Carousel';
import DimensiCard from '../components/DimensiCard';
import SocialMediaCard from '../components/SocialMediaCard';
import FeatureCard from '../components/FeatureCard';

// Import Lucide Icons untuk Fitur Lain
import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  NewspaperIcon,
  TrophyIcon,
  CalendarIcon,
  BookMarkedIcon,
  ClipboardCheckIcon,
  UserCheckIcon,
  GraduationCapIcon,
  NotebookPenIcon,
  WalletIcon
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  // Ambil user untuk mendapatkan idsatuan, idtahunajaran, dan nis
  const { warnaSatuan, user } = useAuthStore();

  // Ambil state dan fungsi dari filterStore
  const { activeThn, activeSmt, setFilter, initializeFilter } = useFilterStore();

  // Mapping Manual ID 0-9 ke Label Tahun
  const listTahun = useMemo(() => [
    { id: '9', label: '2025/2026' },
    { id: '8', label: '2024/2025' },
    { id: '7', label: '2023/2024' },
    { id: '6', label: '2022/2023' },
    { id: '5', label: '2021/2022' },
    { id: '4', label: '2020/2021' },
    { id: '3', label: '2019/2020' },
    { id: '2', label: '2018/2019' },
    { id: '1', label: '2017/2018' },
    { id: '0', label: '2016/2017' },
  ], []);

  useEffect(() => {
    if (user && !activeThn) {
      initializeFilter(user);
    }
  }, [user, activeThn, initializeFilter]);

  const carouselImages = [
    { url: '/assets/images/halamanawal.jpg', caption: 'WORLD CLASS ISLAMIC EDUCATION - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungsma.jpeg', caption: 'SMA ISLAM SABILILLAH - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungsmp.jpeg', caption: 'SMP ISLAM SABILILLAH - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungsd1.jpeg', caption: 'SD ISLAM SABILILLAH 1 - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungsd2.jpeg', caption: 'SD ISLAM SABILILLAH 2 - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungtk1.jpeg', caption: 'TK ISLAM SABILILLAH 1 - Sekolah Pemimpin Peradaban Dunia' },
    { url: '/assets/images/gedungtk2.jpeg', caption: 'TK ISLAM SABILILLAH 2 - Sekolah Pemimpin Peradaban Dunia' },
  ];

  // Menggunakan Ikon Custom yang baru dibuat
  const dimensiCards = [
    { icon: AgamisIcon, title: 'Agamis', path: '/dimensi/agamis' },
    { icon: QuraniIcon, title: 'Qurani', path: '/dimensi/qurani' },
    { icon: NegarawanIcon, title: 'Negarawan', path: '/dimensi/negarawan' },
    { icon: SaintisIcon, title: 'Saintis', path: '/dimensi/saintis' },
    { icon: MultilingualIcon, title: 'Multilingual', path: '/dimensi/multilingual' },
    { icon: BerprestasiIcon, title: 'Berprestasi', path: '/dimensi/berprestasi' }
  ];

  const socialMediaCards = [
    { icon: YoutubeIcon, title: 'YouTube', color: 'bg-red-600', thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400', url: 'https://youtube.com' },
    { icon: InstagramIcon, title: 'Instagram', color: 'bg-pink-600', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', url: 'https://instagram.com' },
    { icon: FacebookIcon, title: 'Facebook', color: 'bg-blue-600', thumbnail: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400', url: 'https://facebook.com' }
  ];

  const kurikulumFeatures = [
    { icon: NewspaperIcon, title: 'Informasi Sekolah', description: 'Berita & Pengumuman', path: '/features/informasi-sekolah' },
    { icon: TrophyIcon, title: 'Prestasi Siswa', description: 'Capaian & Penghargaan', path: '/features/prestasi-siswa' },
    { icon: CalendarIcon, title: 'Jadwal Pelajaran', description: 'Jadwal Harian', path: '/features/jadwal-pelajaran' },
    { icon: BookMarkedIcon, title: 'Majalah Pendidikan', description: 'Bacaan & Artikel', path: '/features/majalah' },
    { icon: ClipboardCheckIcon, title: 'Try Out', description: 'Latihan Soal', path: '/features/try-out' },
    { icon: UserCheckIcon, title: 'Kehadiran Siswa', description: 'Permohonan Izin', path: '/features/kehadiran' },
    { icon: GraduationCapIcon, title: 'Kelulusan', description: 'Info Kelulusan', path: '/features/kelulusan' },
    { icon: NotebookPenIcon, title: 'Rencana Belajar', description: 'Target & Cita-cita', path: '/features/rencana-belajar' },
    { icon: WalletIcon, title: 'Tabungan Karakter', description: 'Poin Karakter', path: '/features/tabungan-karakter' }
  ];

  return (
    <div className="w-full pb-16 bg-white overflow-x-hidden">

      {/* 1. Carousel */}
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
          <div className="sm:rounded-[32px] overflow-hidden shadow-xl aspect-[16/8] sm:aspect-[21/7]">
            <Carousel images={carouselImages} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* 2. Dimensi Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: warnaSatuan }} />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Dimensi</h2>
            </div>
            <div className="flex gap-2">
              {/* Dropdown Tahun Ajaran */}
              <select
                value={activeThn}
                onChange={(e) => setFilter(e.target.value, activeSmt)}
                className="text-xs font-bold border-none bg-gray-100 rounded-xl px-4 py-2 outline-none"
                style={{ color: warnaSatuan }}
              >
                {listTahun.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>

              {/* Dropdown Semester */}
              <select
                value={activeSmt}
                onChange={(e) => setFilter(activeThn, e.target.value)}
                className="text-xs font-bold border-none bg-gray-100 rounded-xl px-4 py-2 outline-none"
                style={{ color: warnaSatuan }}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-8">
            {dimensiCards.map((card) => (
              <DimensiCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                color={warnaSatuan}
                onClick={() => navigate(card.path)}
              />
            ))}
          </div>
        </section>

        {/* 3. Sosial Media */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: warnaSatuan }} />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Update Sismatv</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {socialMediaCards.map((card) => (
              <div key={card.title} className="min-w-[85%] sm:min-w-[380px] snap-center transition-transform hover:scale-[1.01]">
                <SocialMediaCard {...card} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Kurikulum Features */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: warnaSatuan }} />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Layanan Akademik</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kurikulumFeatures.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                color={warnaSatuan}
                onClick={() => navigate(feature.path)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}