import React, { useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import NotificationPage from './pages/NotificationPage';
import NotificationHandler from './components/NotificationHandler';
import PermissionModal from './components/PermissionModal';

// Import Icons
import { addIcons } from 'ionicons';
import {
  logOutOutline, closeOutline, personOutline, bookOutline,
  homeOutline, shieldCheckmarkOutline, schoolOutline, trophyOutline,
  calendarOutline, newspaperOutline, clipboardOutline, starOutline,
  walletOutline, medalOutline, arrowForwardOutline, chevronForwardOutline
} from 'ionicons/icons';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// Import Store & Layout
import { useAuthStore } from './store/authStore';
import { useFilterStore } from './store/filterStore'; // Import filterStore untuk sinkronisasi
import Layout from './components/Layout';

// Import Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AgamisPage from './pages/dimensi/AgamisPage';
import QuraniPage from './pages/dimensi/QuraniPage';
import NegarawanPage from './pages/dimensi/NegarawanPage';
import SaintisPage from './pages/dimensi/SaintisPage';
import MultilingualPage from './pages/dimensi/MultilingualPage';
import BerprestasiPage from './pages/dimensi/BerprestasiPage';
import RaporPage from './pages/RaporPage';
import BantuanPage from './pages/BantuanPage';
import PortofolioPage from './pages/PortofolioPage';
import ProfilePage from './pages/ProfilePage';
import PresensiPage from './pages/features/PresensiPage';
import RencanaBelajarPage from './pages/features/RencanaBelajarPage';
import InformasiSekolahPage from './pages/features/InformasiSekolahPage';
import PrestasiSiswaPage from './pages/features/PrestasiSiswaPage';
import JadwalPelajaranPage from './pages/features/JadwalPelajaranPage';
import MajalahPage from './pages/features/MajalahPage';
import TryOutPage from './pages/features/TryOutPage';
import KelulusanPage from './pages/features/KelulusanPage';
import TabunganKarakterPage from './pages/features/TabunganKarakterPage';

// Global Loading Component
import GlobalLoading from './components/GlobalLoading';

// KEPENGASUHAN
import KepengasuhanPage from './pages/features/KepengasuhanPage';
import RiwayatKesehatanPage from './pages/features/RiwayatKesehatanPage';
import RiwayatKonselingPage from './pages/features/RiwayatKonselingPage';
import KegiatanSantriPage from './pages/features/KegiatanSantriPage';
import PerizinanSantriPage from './pages/features/PerizinanSantriPage';

// Registrasi Icon
addIcons({
  'log-out-outline': logOutOutline,
  'close-outline': closeOutline,
  'person-outline': personOutline,
  'book-outline': bookOutline,
  'home-outline': homeOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'school-outline': schoolOutline,
  'trophy-outline': trophyOutline,
  'calendar-outline': calendarOutline,
  'newspaper-outline': newspaperOutline,
  'clipboard-outline': clipboardOutline,
  'star-outline': starOutline,
  'wallet-outline': walletOutline,
  'medal-outline': medalOutline,
  'arrow-forward-outline': arrowForwardOutline,
  'chevron-forward-outline': chevronForwardOutline
});

setupIonicReact();

// DEFINISI INTERFACE
export interface StudentData {
  id_satuan: number;
  id: string | number;
  name: string;
  nis: string;
  kelas: any;
  avatar?: string;
}

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  // ⛔ Jangan render apa pun selama auth masih dicek
  if (isInitializing) {
    return null; // atau <GlobalLoading message="Menyiapkan sesi..." />
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  // Ambil semua state yang dibutuhkan dari store
  const {
    isAuthenticated,
    isInitializing,
    isLoading, // Ambil state loading global dari axios
    initialize,
    warnaSatuan,
    logout,
    user
  } = useAuthStore();

  const { initializeFilter } = useFilterStore(); // Ambil fungsi init filter

  useEffect(() => {
    // Jalankan inisialisasi saat aplikasi pertama kali dimuat (Cek sesi)
    const initApp = async () => {
      await initialize();
    };
    initApp();
  }, [initialize]);

  // Tambahan: Pastikan filter terisi setiap kali user data tersedia (misal setelah refresh)
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     initializeFilter(user);
  //   }
  // }, [isAuthenticated, user, initializeFilter]);

  useEffect(() => {
    // Update CSS Variable untuk tema warna satuan
    document.documentElement.style.setProperty('--warna-satuan', warnaSatuan);
    document.documentElement.style.setProperty('--ion-color-primary', warnaSatuan);
  }, [warnaSatuan]);

  // Persiapkan data siswa untuk Layout dan Page
  const studentData: StudentData = {
    id_satuan: Number(user?.idsatuan || user?.IDSATUAN || 0),
    id: user?.id || user?.username || '',
    name: user?.nama || '',
    nis: user?.nis || '',
    kelas: user?.kelas || '',
    avatar: user?.foto
  };

  return (
    <IonApp>
      {/* LOGIKA LOADING GLOBAL:
        1. Jika sedang inisialisasi sesi (saat F5/Buka App)
        2. Jika sedang ada request API (isLoading dari interceptor axios)
      */}
      {isInitializing && (
        <GlobalLoading message="Sinkronisasi Sesi..." />
      )}

      {isLoading && !isInitializing && (
        <GlobalLoading message="Memuat Data..." />
      )}

      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* --- TARO DISINI --- */}
        <NotificationHandler />
        <PermissionModal />
        {/* ------------------- */}
        <IonRouterOutlet>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={() => { }} />}
            />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout studentData={studentData} onLogout={logout}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="dimensi/agamis" element={<AgamisPage />} />
                      <Route path="dimensi/qurani" element={<QuraniPage studentName={studentData.name} />} />
                      <Route path="dimensi/negarawan" element={<NegarawanPage />} />
                      <Route path="dimensi/saintis" element={<SaintisPage />} />
                      <Route path="dimensi/multilingual" element={<MultilingualPage />} />
                      <Route path="dimensi/berprestasi" element={<BerprestasiPage />} />
                      <Route path="rapor" element={<RaporPage />} />
                      <Route path="bantuan" element={<BantuanPage />} />
                      <Route path="portofolio" element={<PortofolioPage studentName={studentData.name} />} />
                      <Route path="profile" element={<ProfilePage studentData={studentData} onLogout={logout} />} />
                      <Route path="notifications" element={<NotificationPage />} />
                      <Route path="features/kehadiran" element={<PresensiPage />} />
                      <Route path="features/rencana-belajar" element={<RencanaBelajarPage studentData={studentData} />} />
                      <Route path="features/informasi-sekolah" element={<InformasiSekolahPage />} />
                      <Route path="features/prestasi-siswa" element={<PrestasiSiswaPage />} />
                      <Route path="features/jadwal-pelajaran" element={<JadwalPelajaranPage />} />
                      <Route path="features/majalah" element={<MajalahPage />} />
                      <Route path="features/try-out" element={<TryOutPage />} />
                      <Route path="features/kehadiran-siswa" element={<PresensiPage />} />
                      <Route path="features/kelulusan" element={<KelulusanPage />} />
                      <Route path="features/tabungan-karakter" element={<TabunganKarakterPage />} />
                      <Route path="features/kepengasuhan" element={<KepengasuhanPage />} />
                      <Route path="features/riwayat-kesehatan" element={<RiwayatKesehatanPage />} />
                      <Route path="features/riwayat-konseling" element={<RiwayatKonselingPage />} />
                      <Route path="features/kegiatan-santri" element={<KegiatanSantriPage />} />
                      <Route path="features/perizinan-santri" element={<PerizinanSantriPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </IonRouterOutlet>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;