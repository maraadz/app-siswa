import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFilterStore } from '../store/filterStore';
import { getQuraniCapaian, getRekapDimensi } from '../services/dimensiService'; // Pastikan path benar
import { useNotificationStore } from '../store/notificationStore';
import { getSismatvVideos } from '../services/youtubeService';

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
import FeatureCard from '../components/FeatureCard';

// Import Lucide Icons untuk Fitur Lain
import {
  // YoutubeIcon,
  // InstagramIcon,
  // FacebookIcon,
  ShieldCheck,
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
  const { warnaSatuan, user, isAuthenticated } = useAuthStore();

  // Ambil state dan fungsi dari filterStore
  const { activeThn, activeSmt, setFilter, listTahun } = useFilterStore();

  const { addNotification } = useNotificationStore();

  const [ytVideos, setYtVideos] = useState<any[]>([]);

  // --- LOGIKA AMBIL VIDEO YOUTUBE ---
  useEffect(() => {
    const loadVideos = async () => {
      const videos = await getSismatvVideos();
      setYtVideos(videos);
    };
    loadVideos();
  }, []);

  // --- LOGIKA KLIK & TRACKING ---
  const handleWatchVideo = async (video: any) => {
    const videoId = video.id.videoId;
    // Simpan tanda di HP siswa bahwa video ini sudah diklik
    localStorage.setItem(`watched_${videoId}_${user?.id}`, 'true');

    // Buka YouTube
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');

    // Refresh state agar badge "BARU!" hilang
    const updatedVideos = await getSismatvVideos();
    setYtVideos(updatedVideos);
  };

  // ==========================================
  // LOGIKA PESAN SUARA (TEXT-TO-SPEECH)
  // ==========================================
  const playVoiceNotification = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 1. LOGIKA SALAM OTOMATIS SAAT LOGIN/MASUK ---
  useEffect(() => {
    // Cek apakah sudah salam di sesi ini lewat sessionStorage
    const hasGreetedThisSession = sessionStorage.getItem(`greeted_${user?.id}`);

    if (isAuthenticated && user && !hasGreetedThisSession) {
      const namaSiswa = user.nama || 'Ananda';
      const salamText = `Assalamualaikum ananda ${namaSiswa}, selamat datang di Sisma Apps. Barakallah fii ilmik.`;

      // Delay sedikit agar loading selesai baru bersuara
      setTimeout(() => {
        playVoiceNotification(salamText);
      }, 1000);

      // Tandai di session storage supaya tidak bunyi lagi selama tab belum ditutup
      sessionStorage.setItem(`greeted_${user.id}`, 'true');
    }
  }, [isAuthenticated, user]);

  // --- 2. LOGIKA AUTO-CHECK DATA BARU ---
  useEffect(() => {
    const checkAllDimensions = async () => {
      if (!isAuthenticated || !user || !activeThn || !activeSmt) return;

      // Variable untuk tracking apakah ada data baru secara global
      let globalUpdateFound = false;

      const runRadar = async (name: string, fetchFn: () => Promise<any>, storageKey: string, title: string) => {
        try {
          const res = await fetchFn();

          if (res?.status === 'ok') {
            let currentCount = 0;

            if (name === 'qurani') {
              currentCount = res.data?.capaian_terpenuhi?.length || 0;
            } else {
              const sklData = res.nilai?.[0]?.SKL || res.data?.nilai?.[0]?.skl || [];
              currentCount = sklData.filter((n: any) => {
                const val = n.NILAI || n.nilai;
                return val && Array.isArray(val) && val[0] !== "" && val[0] !== "-";
              }).length;
            }

            const rawPrev = localStorage.getItem(storageKey);

            if (rawPrev !== null) {
              const prevCount = parseInt(rawPrev);
              if (currentCount > prevCount) {
                const diff = currentCount - prevCount;
                globalUpdateFound = true; // Tandai ada update

                // Notif khusus dimensi (Tetap Ada)
                addNotification({
                  title: title,
                  message: `Alhamdulillah, ada ${diff} data baru pada ${new Date().toLocaleTimeString()}.`,
                  type: 'info'
                });

                // Suara khusus dimensi (Tetap Ada)
                playVoiceNotification(`Update data baru pada dimensi ${name}.`);
              }
            }
            localStorage.setItem(storageKey, currentCount.toString());
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.debug(`[Radar] ${name} silent failure (Server 500).`);
          }
        }
      };

      // Jalankan semua radar secara PARALEL
      await Promise.allSettled([
        runRadar('agamis', () => getRekapDimensi(activeThn, activeSmt, 1), `last_cnt_agamis_${user.id}`, 'Update Agamis!'),
        runRadar('negarawan', () => getRekapDimensi(activeThn, activeSmt, 3), `last_cnt_negarawan_${user.id}`, 'Update Negarawan!'),
        runRadar('qurani', () => getQuraniCapaian('terjemah', activeThn), `last_cnt_qurani_terjemah_${user.id}`, 'Capaian Qurani Baru!'),
        runRadar('saintis', () => getRekapDimensi(activeThn, activeSmt, 4), `last_cnt_saintis_${user.id}`, 'Update Saintis!'),
        runRadar('multilingual', () => getRekapDimensi(activeThn, activeSmt, 5), `last_cnt_multilingual_${user.id}`, 'Update Nilai Bahasa!'),
        runRadar('berprestasi', () => getRekapDimensi(activeThn, activeSmt, 6), `last_cnt_berprestasi_${user.id}`, 'Update Prestasi Baru!')
      ]);

      // --- NOTIFIKASI GLOBAL ---
      if (globalUpdateFound) {
        playVoiceNotification("MasyaAllah, ada capaian baru untukmu. Silakan periksa seluruh halaman dimensi.");
      }
    };

    checkAllDimensions();
    const interval = setInterval(checkAllDimensions, 2 * 60 * 1000);
    return () => clearInterval(interval);

  }, [isAuthenticated, user, activeThn, activeSmt, addNotification]);

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

  // const socialMediaCards = [
  //   { icon: YoutubeIcon, title: 'YouTube', color: 'bg-red-600', thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400', url: 'https://youtube.com' },
  //   { icon: InstagramIcon, title: 'Instagram', color: 'bg-pink-600', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', url: 'https://instagram.com' },
  //   { icon: FacebookIcon, title: 'Facebook', color: 'bg-blue-600', thumbnail: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400', url: 'https://facebook.com' }
  // ];

  const idSatuan = Number(user?.idsatuan || user?.IDSATUAN || 0);
  const isSMA = [5].includes(idSatuan); // Sesuaikan ID Satuan SMA kamu

  const allFeatures = [
    { icon: NewspaperIcon, title: 'Informasi Sekolah', description: 'Berita & Pengumuman', path: '/features/informasi-sekolah', show: true },
    { icon: TrophyIcon, title: 'Prestasi Siswa', description: 'Capaian & Penghargaan', path: '/features/prestasi-siswa', show: !isSMA },
    {
      icon: ShieldCheck, // Ganti ini
      title: 'Kepengasuhan',
      description: 'Layanan Mahad SMAIS',
      path: '/features/kepengasuhan',
      show: isSMA
    },
    { icon: CalendarIcon, title: 'Jadwal Pelajaran', description: 'Jadwal Harian', path: '/features/jadwal-pelajaran', show: true },
    { icon: BookMarkedIcon, title: 'Majalah Pendidikan', description: 'Bacaan & Artikel', path: '/features/majalah', show: true },
    { icon: ClipboardCheckIcon, title: 'Try Out', description: 'Latihan Soal', path: '/features/try-out', show: true },
    { icon: UserCheckIcon, title: 'Kehadiran Siswa', description: 'Permohonan Izin', path: '/features/kehadiran', show: true },
    { icon: GraduationCapIcon, title: 'Kelulusan', description: 'Info Kelulusan', path: '/features/kelulusan', show: true },
    { icon: NotebookPenIcon, title: 'Rencana Belajar', description: 'Target & Cita-cita', path: '/features/rencana-belajar', show: true },
    { icon: WalletIcon, title: 'Tabungan Karakter', description: 'Poin Karakter', path: '/features/tabungan-karakter', show: !isSMA }
  ];

  const kurikulumFeatures = allFeatures.filter(f => f.show);

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
            {/* BAGIAN DROPDOWN SEKARANG JADI DARI API: */}
            <div className="flex gap-2">
              <select
                value={activeThn}
                onChange={(e) => setFilter(e.target.value, activeSmt)}
                className="text-xs font-bold border-none bg-gray-100 rounded-xl px-4 py-2 outline-none"
                style={{ color: warnaSatuan }}
              >
                {/* Render list dari API */}
                {listTahun.length > 0 ? (
                  listTahun.map((t) => (
                    <option key={t.IDTAHUNAJARAN} value={t.IDTAHUNAJARAN}>
                      {t.TAHUN_AJARAN}
                    </option>
                  ))
                ) : (
                  <option value={activeThn}>Memuat Tahun...</option>
                )}
              </select>

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
              <DimensiCard key={card.title} icon={card.icon} title={card.title} color={warnaSatuan} onClick={() => navigate(card.path)} />
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
            {ytVideos.length > 0 ? (
              ytVideos.map((video) => {
                const isWatched = localStorage.getItem(`watched_${video.id.videoId}_${user?.id}`);

                return (
                  <div
                    key={video.id.videoId}
                    onClick={() => handleWatchVideo(video)}
                    className="min-w-[85%] sm:min-w-[380px] snap-center cursor-pointer transition-transform hover:scale-[1.01]"
                  >
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg">
                      <img
                        src={video.snippet.thumbnails.high.url}
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Badge Status */}
                      <div className="absolute top-4 left-4">
                        {isWatched ? (
                          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-green-600 shadow-sm">
                            SUDAH CEK
                          </span>
                        ) : (
                          <span className="bg-red-600 px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-lg animate-pulse">
                            BARU!
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-4 font-bold text-gray-800 line-clamp-2 px-1">
                      {video.snippet.title}
                    </h3>
                  </div>
                );
              })
            ) : (
              // Loading State sederhana
              <div className="w-full text-center py-10 text-gray-400 text-sm italic">
                Menghubungkan ke Sismatv...
              </div>
            )}
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
              <FeatureCard key={feature.title} {...feature} color={warnaSatuan} onClick={() => navigate(feature.path)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}