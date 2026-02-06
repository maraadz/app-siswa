import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAlert,
  IonLoading,
  IonButtons,
  IonBackButton,
  IonThumbnail,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast
} from '@ionic/react';
import {
  logOutOutline,
  cameraOutline,
  helpCircleOutline,
  settingsOutline,
  personOutline,
  chevronForwardOutline,
  lockClosedOutline
} from 'ionicons/icons';
import { StudentData } from '../App';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

interface ProfilePageProps {
  studentData: StudentData;
  onLogout: () => void;
}

export default function ProfilePage({ studentData, onLogout }: ProfilePageProps) {
  const navigate = useNavigate();
  const [present] = useIonToast();
  const { warnaSatuan } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [identitas, setIdentitas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);

  // Load Data dari API
  useEffect(() => {
    const fetchIdentitas = async () => {
      try {
        const response = await api.get('/api/siswa/identitas');
        if (response.data.status === "ok") {
          setIdentitas(response.data.identitas.siswa);
        }
      } catch (err) {
        console.error("Gagal sinkron data identitas", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdentitas();
  }, []);

  // Fungsi Upload Foto (Kamera)
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      setIsLoading(true);
      try {
        const res = await api.post('/api/siswa/update-avatar', formData);
        if (res.data.status === "ok") {
          present({
            message: 'Foto profil berhasil diperbarui!',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          window.location.reload();
        }
      } catch (err) {
        present({
          message: 'Gagal upload foto.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // FUNGSI UBAH PASSWORD (Siap konek ke API)
  const handleUpdatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      present({
        message: 'Password minimal 6 karakter!',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Endpoint ini disesuaikan dengan dokumentasi API kamu nanti
      const res = await api.post('/api/siswa/update-password', { password: newPassword });

      if (res.data.status === "ok") {
        present({
          message: 'Password berhasil diubah!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
      }
    } catch (err) {
      present({
        message: 'Gagal mengubah password. Coba lagi nanti.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayKelas = typeof studentData.kelas === 'object'
    ? studentData.kelas.nama_kelas
    : studentData.kelas;

  if (isLoading) return <IonLoading isOpen={true} message="Sinkronisasi Database..." />;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#fff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Kembali" />
          </IonButtons>
          <IonTitle className="font-bold text-slate-800">Profil Saya</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-slate-50">
        <div className="max-w-2xl mx-auto pb-20">

          {/* SECTION 1: HEADER PROFILE */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 mt-2">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative">
                <IonThumbnail className="w-28 h-28 rounded-2xl overflow-hidden shadow-md border-4 border-slate-50">
                  {studentData.avatar ? (
                    <img src={studentData.avatar} alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <IonIcon icon={personOutline} className="text-5xl text-slate-400" />
                    </div>
                  )}
                </IonThumbnail>

                <div
                  onClick={handleUploadClick}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer border-4 border-white active:scale-95 transition-transform"
                  style={{ backgroundColor: warnaSatuan }}
                >
                  <IonIcon icon={cameraOutline} className="text-lg" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-800 mb-1 leading-tight">
                  {identitas?.nama || studentData.name}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {displayKelas}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    NIS: {studentData.nis}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <IonButton
                    size="small"
                    className="font-bold m-0"
                    style={{ '--background': warnaSatuan, '--border-radius': '12px' }}
                  >
                    UBAH PROFIL
                  </IonButton>
                  <IonButton
                    size="small"
                    fill="outline"
                    className="font-bold m-0"
                    style={{ '--color': warnaSatuan, '--border-color': warnaSatuan, '--border-radius': '12px' }}
                    onClick={() => setShowPasswordAlert(true)}
                  >
                    <IonIcon slot="start" icon={lockClosedOutline} />
                    UBAH PASSWORD
                  </IonButton>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: BIODATA */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Detail Identitas Siswa</h3>
            </div>

            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" sizeSm="6" className="border-b border-r border-slate-50">
                  <ProfileItem label="Nama Lengkap" value={identitas?.nama || studentData.name} />
                </IonCol>
                <IonCol size="12" sizeSm="6" className="border-b border-slate-50">
                  <ProfileItem label="Username / NIS" value={studentData.nis} />
                </IonCol>
                <IonCol size="12" sizeSm="6" className="border-b border-r border-slate-50">
                  <ProfileItem label="Jenis Kelamin" value={identitas?.jenis_kelamin} />
                </IonCol>
                <IonCol size="12" sizeSm="6" className="border-b border-slate-50">
                  <ProfileItem label="Tempat Lahir" value={identitas?.tempat_lahir} />
                </IonCol>
                <IonCol size="12" sizeSm="6" className="border-b border-r border-slate-50">
                  <ProfileItem label="Tanggal Lahir" value={identitas?.tanggal_lahir} />
                </IonCol>
                <IonCol size="12" sizeSm="6" className="border-b border-slate-50">
                  <ProfileItem label="Email Sabilillah" value={`${studentData.nis}@sabilillah.sch.id`} />
                </IonCol>
                <IonCol size="12">
                  <ProfileItem label="Alamat Rumah" value={identitas?.alamat} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          {/* SECTION 3: MENU LAINNYA */}
          <IonList inset={true} className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <IonItem button detail={false}>
              <div slot="start" className="p-2 bg-slate-100 rounded-xl text-slate-500 mr-2">
                <IonIcon icon={settingsOutline} />
              </div>
              <IonLabel className="text-sm font-bold text-slate-700">Pengaturan</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} className="text-slate-300 text-xs" />
            </IonItem>
            <IonItem button detail={false} onClick={() => navigate('/bantuan')}>
              <div slot="start" className="p-2 bg-slate-100 rounded-xl text-slate-500 mr-2">
                <IonIcon icon={helpCircleOutline} />
              </div>
              <IonLabel className="text-sm font-bold text-slate-700">Bantuan & FAQ</IonLabel>
              <IonIcon slot="end" icon={chevronForwardOutline} className="text-slate-300 text-xs" />
            </IonItem>
          </IonList>

          {/* SECTION 4: LOGOUT */}
          <div className="px-4">
            <IonButton
              expand="block"
              color="danger"
              fill="clear"
              className="font-black text-xs tracking-widest"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              KELUAR DARI SISTEM
            </IonButton>
          </div>
        </div>

        {/* ALERT LOGOUT */}
        <IonAlert
          isOpen={showLogoutConfirm}
          onDidDismiss={() => setShowLogoutConfirm(false)}
          header="Konfirmasi Keluar"
          message="Apakah anda yakin ingin mengakhiri sesi ini?"
          buttons={[
            { text: 'Batal', role: 'cancel' },
            {
              text: 'Ya, Keluar',
              role: 'destructive',
              handler: () => {
                onLogout();
                navigate('/login');
              }
            }
          ]}
        />

        {/* ALERT UBAH PASSWORD - Sesuai Permintaan Gambar */}
        <IonAlert
          isOpen={showPasswordAlert}
          onDidDismiss={() => setShowPasswordAlert(false)}
          header="Ubah Password ?"
          subHeader="Gunakan kombinasi huruf, angka, dan simbol (ASCII). Contoh: sabilillah123_!@#"
          inputs={[
            {
              name: 'pass',
              type: 'password',
              placeholder: 'Masukkan Password (required)',
            }
          ]}
          buttons={[
            {
              text: 'BATAL',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'SIMPAN',
              handler: (data) => {
                handleUpdatePassword(data.pass);
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}

function ProfileItem({ label, value }: { label: string, value?: string }) {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <p className="text-[9px] font-black text-emerald-600 uppercase mb-0.5 tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || '-'}</p>
    </div>
  );
}