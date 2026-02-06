import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  IonModal, IonInput, IonTextarea, useIonToast
} from '@ionic/react';
import {
  chevronBackOutline, personOutline, heartOutline,
  peopleOutline, pencilOutline,
  saveOutline, closeOutline, eyeOutline, star,
  ribbonOutline, printOutline, documentTextOutline,
  extensionPuzzleOutline, downloadOutline, schoolOutline,
  trashOutline, addOutline
} from 'ionicons/icons';
import { Loader2, ClipboardList, GraduationCap, Briefcase, MapPin } from 'lucide-react';

import {
  getIdentitas,
  getPerencanaan,
  getPsikologi,
  getPsikologiDetail,
  getPlacement,
  getPlacementDetail,
  updateCitaCita,
  getTargetGrouped,
  getCapaianGrouped,
  getStudiLanjut
} from '../../services/rencanaBelajar.service';

import { StudentData } from '../../App';

interface Props { studentData: StudentData; }

const RencanaBelajarPage: React.FC<Props> = ({ studentData }) => {
  const [present] = useIonToast();
  const [tab, setTab] = useState<'profil' | 'perencanaan' | 'psikologi' | 'placement' | 'studi'>('profil');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStudiModal, setShowEditStudiModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- STATE DATA UTAMA ---
  const [rawIdentitas, setRawIdentitas] = useState<any>(null);
  const [perencanaanList, setPerencanaanList] = useState<any[]>([]);
  const [psikologiList, setPsikologiList] = useState<any[]>([]);
  const [placementList, setPlacementList] = useState<any[]>([]);
  const [studiLanjutList, setStudiLanjutList] = useState<any[]>([]);

  // --- STATE MODAL DETAIL ---
  const [detailData, setDetailData] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalType, setModalType] = useState<'rencana' | 'capaian' | 'placement' | 'psikologi'>('rencana');

  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    hobi: '', rumusan: '', alasan: '', jurusan: '', pedukung: '', penghambat: ''
  });

  const [studiFormData, setStudiFormData] = useState({
    rekomendasi: '',
    pilihan: [{ kampus: '', jurusan: '' }]
  });

  const { accessToken, isInitializing } = useAuthStore();

  // --- INITIALIZATION ---
  useEffect(() => {
    if (isInitializing) return;
    if (!accessToken) return;
    loadAllData();
  }, [isInitializing, accessToken]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [identitas, perencanaan, psikologi, placement, studi] = await Promise.all([
        getIdentitas(),
        getPerencanaan(),
        getPsikologi(),
        getPlacement(),
        studentData.id_satuan === 5 ? getStudiLanjut() : Promise.resolve([])
      ]);

      // Handle Identitas & Form Cita-cita
      if (identitas && identitas.identitas) {
        setRawIdentitas(identitas.identitas);
        const s = identitas.identitas.siswa;
        setFormData({
          hobi: s?.hobi || '',
          rumusan: s?.rumusan || '',
          alasan: s?.alasan || '',
          jurusan: s?.jurusan || '',
          pedukung: s?.pedukung || '',
          penghambat: s?.penghambat || ''
        });
      }

      setPerencanaanList(Array.isArray(perencanaan) ? perencanaan : []);
      setPsikologiList(Array.isArray(psikologi) ? psikologi : []);
      setPlacementList(Array.isArray(placement) ? placement : []);
      setStudiLanjutList(Array.isArray(studi) ? studi : []);

      // Inisialisasi Form Studi Lanjut jika ada data
      if (studi && studi.length > 0) {
        setStudiFormData({
          rekomendasi: studi[0].REKOMENDASI || '',
          pilihan: studi[0].rencana?.length > 0
            ? studi[0].rencana.map((r: any) => ({ kampus: r.KAMPUS, jurusan: r.JURUSAN }))
            : [{ kampus: '', jurusan: '' }]
        });
      }
    } catch (error) {
      console.error(error);
      present({ message: 'Gagal sinkronisasi data server', color: 'danger', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---

  const handleUpdateCitaCita = async () => {
    setSaving(true);
    try {
      await updateCitaCita(formData);
      present({ message: 'Impian berhasil diperbarui', color: 'success', duration: 2000 });
      setShowEditModal(false);
      loadAllData();
    } catch (err) {
      present({ message: 'Gagal menyimpan data', color: 'danger', duration: 2000 });
    } finally {
      setSaving(false);
    }
  };

  const handleShowDetail = async (p: any, type: 'rencana' | 'capaian') => {
    try {
      const payload = {
        IDSATUAN: studentData.id_satuan,
        IDSISWA: Number(p.IDSISWA),
        IDTAHUNAJARAN: Number(p.IDTAHUNAJARAN),
        SEMESTER: Number(p.SEMESTER)
      };

      const response = type === 'rencana'
        ? await getTargetGrouped(payload)
        : await getCapaianGrouped(payload);

      // Mengambil data murni dari response (biasanya response.data)
      const dataContent = response.data ? response.data : response;

      setDetailData({ info: p, data: dataContent });
      setModalType(type);
      setShowDetailModal(true);
    } catch {
      present({ message: 'Gagal memuat detail perencanaan', color: 'danger', duration: 2000 });
    }
  };

  const handleShowPlacement = async (p: any) => {
    try {
      const payload = {
        IDSATUAN: studentData.id_satuan,
        IDSISWA: Number(p.IDSISWA),
        IDTAHUNAJARAN: Number(p.IDTAHUNAJARAN)
      };
      const response = await getPlacementDetail(payload);
      setDetailData({ info: p, data: response.data || response });
      setModalType('placement');
      setShowDetailModal(true);
    } catch {
      present({ message: 'Detail placement belum tersedia', color: 'warning', duration: 2000 });
    }
  };

  const handleShowPsikologiDetail = async (p: any) => {
    try {
      const response = await getPsikologiDetail(p.IDPSIKOLOGI);
      setDetailData({ info: p, data: response.data || response });
      setModalType('psikologi');
      setShowDetailModal(true);
    } catch {
      present({ message: 'Gagal memuat analisis psikologi', color: 'danger', duration: 2000 });
    }
  };

  const handleViewPsikologiFile = (p: any) => {
    if (!p.FILE_HASIL) {
      present({ message: 'File lampiran tidak ditemukan', duration: 2000 });
      return;
    }
    window.open(`/api/rencana-belajar/file?path=${encodeURIComponent(p.FILE_HASIL)}`, '_blank');
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Memproses Data Siswa...</p>
        </div>
      </IonContent>
    </IonPage>
  );

  const { siswa, ayah, ibu, wali } = rawIdentitas || {};

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#fff', '--padding-top': '12px' }}>
          <IonButtons slot="start">
            <IonButton routerLink="/" routerDirection="back" className="ml-2">
              <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px', color: '#111' }} />
            </IonButton>
          </IonButtons>
          <IonTitle className="font-black text-gray-800 tracking-tight">RENCANA BELAJAR</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-gray-50">
        <div className="max-w-4xl mx-auto pb-24">

          {/* --- PROFILE HEADER CARD --- */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <img
                src={`https://ui-avatars.com/api/?name=${siswa?.nama}&background=10b981&color=fff&bold=true&size=128`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl relative z-10" alt="Avatar"
              />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tight">{siswa?.nama}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{studentData.nis}</span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{siswa?.kelas}</span>
            </div>

            <IonSegment value={tab} onIonChange={(e: any) => setTab(e.detail.value)} mode="ios" className="mt-8 p-1 bg-gray-50 rounded-2xl">
              <IonSegmentButton value="profil"><IonLabel className="font-bold">Profil</IonLabel></IonSegmentButton>
              <IonSegmentButton value="perencanaan"><IonLabel className="font-bold">Rencana</IonLabel></IonSegmentButton>
              <IonSegmentButton value="psikologi"><IonLabel className="font-bold">Psikolog</IonLabel></IonSegmentButton>
              <IonSegmentButton value="placement"><IonLabel className="font-bold">Placement</IonLabel></IonSegmentButton>
              {studentData.id_satuan === 5 && (
                <IonSegmentButton value="studi"><IonLabel className="font-bold">Studi</IonLabel></IonSegmentButton>
              )}
            </IonSegment>
          </div>

          {/* --- TAB CONTENT: PROFIL --- */}
          {tab === 'profil' && (
            <div className="animate__animated animate__fadeIn space-y-6">
              <SectionBox icon={personOutline} title="Biodata Lengkap" color="emerald">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Tempat, Tanggal Lahir" value={`${siswa?.tempat_lahir || '-'}, ${siswa?.tanggal_lahir || '-'}`} />
                  <InfoItem label="Alamat Domisili" value={siswa?.alamat} />
                </div>
              </SectionBox>

              <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 relative shadow-sm overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-100/50 rounded-full blur-3xl"></div>
                <button onClick={() => setShowEditModal(true)} className="absolute top-6 right-6 bg-white p-3 rounded-2xl text-rose-500 shadow-md hover:scale-110 transition-all active:scale-95 z-10">
                  <IonIcon icon={pencilOutline} style={{ fontSize: '20px' }} />
                </button>
                <div className="flex items-center gap-2 mb-6 text-rose-600 relative z-10">
                  <IonIcon icon={heartOutline} style={{ fontSize: '20px' }} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Visi & Impian</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl mb-6 border border-rose-100 shadow-inner relative z-10">
                  <p className="text-[9px] font-black text-rose-400 uppercase mb-2 tracking-widest">Rumusan Cita-Cita</p>
                  <p className="italic text-gray-800 text-lg font-serif font-medium leading-relaxed">"{siswa?.rumusan || 'Impian belum dirumuskan...'}"</p>
                </div>
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <InfoItem label="Hobi" value={siswa?.hobi} />
                  <InfoItem label="Target Jurusan" value={siswa?.jurusan} />
                  <InfoItem label="Faktor Pendukung" value={siswa?.pedukung} />
                  <InfoItem label="Faktor Penghambat" value={siswa?.penghambat} />
                </div>
              </div>

              <SectionBox icon={peopleOutline} title="Orang Tua & Wali" color="blue">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ParentMiniCard label="Ayah" name={ayah?.nama} job={ayah?.pekerjaan} icon={personOutline} />
                  <ParentMiniCard label="Ibu" name={ibu?.nama} job={ibu?.pekerjaan} icon={personOutline} />
                  <ParentMiniCard label="Wali" name={siswa?.nama_wali || wali?.nama_wali} job={siswa?.pekerjaan_wali || wali?.pekerjaan_wali} icon={Briefcase} />
                </div>
              </SectionBox>
            </div>
          )}

          {/* --- TAB CONTENT: PERENCANAAN --- */}
          {tab === 'perencanaan' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 animate__animated animate__fadeIn">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] shadow-inner"><ClipboardList size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Evaluasi Belajar</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target & Realisasi per Semester</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengasuh</th>
                      <th className="p-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Periode</th>
                      <th className="p-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {perencanaanList.length > 0 ? perencanaanList.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5">
                          <p className="font-black text-sm text-gray-800 uppercase leading-tight">{p.NAMA_PENGASUH}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Penilai Utama</p>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">
                            {p.TAHUN_AJARAN} | S{p.SEMESTER}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => handleShowDetail(p, 'rencana')} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] hover:bg-indigo-600 hover:text-white transition-all">
                            <IonIcon icon={eyeOutline} className="mr-1" /> RENCANA
                          </button>
                          <button onClick={() => handleShowDetail(p, 'capaian')} className="p-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-[10px] hover:bg-amber-600 hover:text-white transition-all">
                            <IonIcon icon={ribbonOutline} className="mr-1" /> CAPAIAN
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="p-10 text-center font-bold text-gray-300 uppercase text-xs">Belum ada riwayat perencanaan</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB CONTENT: PSIKOLOGI --- */}
          {tab === 'psikologi' && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              {psikologiList.map((p, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="text-center md:border-r md:pr-10 min-w-[160px] flex flex-col justify-center items-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Kecerdasan (IQ)</p>
                      <div className="text-6xl font-black text-indigo-600 mb-2 drop-shadow-sm">{p.IQ}</div>
                      <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-2xl inline-block shadow-sm ${p.IQ >= 110 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {p.KATEGORI}
                      </span>
                      <div className="mt-6 flex flex-col gap-2 w-full">
                        <button onClick={() => handleViewPsikologiFile(p)} className="text-[9px] font-black text-emerald-600 bg-emerald-50 py-2.5 rounded-xl flex items-center justify-center gap-2 uppercase hover:bg-emerald-600 hover:text-white transition-all">
                          <IonIcon icon={downloadOutline} /> Lampiran PDF
                        </button>
                        <button onClick={() => handleShowPsikologiDetail(p)} className="text-[9px] font-black text-indigo-600 bg-indigo-50 py-2.5 rounded-xl flex items-center justify-center gap-2 uppercase hover:bg-indigo-600 hover:text-white transition-all">
                          <IonIcon icon={eyeOutline} /> Detail Analisis
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MiniTable label="Minat Utama" icon={star} value={p.MINAT} color="amber" />
                      <MiniTable label="Gaya Belajar" icon={extensionPuzzleOutline} value={p.GAYA_BELAJAR} color="purple" />
                      <div className="col-span-full bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Rekomendasi Psikolog</p>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium italic">"{p.KESIMPULAN || 'Hasil observasi standar tersedia pada detail analisis.'}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- TAB CONTENT: PLACEMENT --- */}
          {tab === 'placement' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate__animated animate__fadeIn">
              {placementList.map((p, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
                      <GraduationCap size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-sm uppercase leading-tight">{p.NAMA_PENGASUH || 'Placement Test'}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{p.TAHUN_AJARAN}</p>
                    </div>
                  </div>
                  <button onClick={() => handleShowPlacement(p)} className="bg-gray-50 p-4 rounded-2xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all active:scale-90">
                    <IonIcon icon={eyeOutline} className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* --- TAB CONTENT: STUDI LANJUT --- */}
          {tab === 'studi' && studentData.id_satuan === 5 && (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <div className="flex justify-end">
                <button onClick={() => setShowEditStudiModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all">
                  <IonIcon icon={pencilOutline} /> Update Rencana Studi
                </button>
              </div>

              {studiLanjutList.length > 0 ? studiLanjutList.map((s, idx) => (
                <div key={idx} className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-50">
                    <div className="p-4 bg-violet-50 text-violet-600 rounded-[1.5rem] shadow-inner">
                      <IonIcon icon={schoolOutline} style={{ fontSize: '24px' }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Kesiapan Studi Lanjut</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tahun Akademik {s.TAHUN_AJARAN}</p>
                    </div>
                  </div>

                  <div className="mb-8 bg-violet-50/30 p-6 rounded-[2rem] border border-violet-100/50 shadow-inner">
                    <p className="text-[10px] font-black text-violet-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                      <IonIcon icon={documentTextOutline} /> Rekomendasi Akademik
                    </p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed italic">"{s.REKOMENDASI || 'Belum ada catatan rekomendasi.'}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {s.rencana?.map((ren: any, i: number) => (
                      <div key={i} className="flex items-start gap-5 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 group hover:border-emerald-200 hover:bg-white transition-all shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-md shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Prioritas {i + 1}</p>
                          <h4 className="font-black text-gray-800 text-sm uppercase leading-tight">{ren.KAMPUS}</h4>
                          <p className="text-xs font-bold text-emerald-600 mt-1">{ren.JURUSAN}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-gray-200">
                  <p className="text-gray-300 font-black uppercase text-xs tracking-widest">Data rencana studi belum diinput</p>
                </div>
              )}
            </div>
          )}

        </div>
      </IonContent>

      {/* --- MODAL SECTION --- */}

      {/* 1. MODAL EDIT RENCANA STUDI */}
      <IonModal isOpen={showEditStudiModal} onDidDismiss={() => setShowEditStudiModal(false)} className="full-modal">
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--padding-top': '12px' }}>
            <IonTitle className="font-black text-gray-800">RENCANA STUDI</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditStudiModal(false)}><IonIcon icon={closeOutline} style={{ fontSize: '28px' }} /></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="max-w-lg mx-auto space-y-6 pb-12">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <label className="text-[10px] font-black text-emerald-600 uppercase mb-3 block tracking-widest">Rekomendasi Hasil Tes</label>
              <IonTextarea
                value={studiFormData.rekomendasi}
                onIonInput={(e) => setStudiFormData({ ...studiFormData, rekomendasi: e.detail.value! })}
                rows={4}
                className="bg-gray-50 rounded-2xl px-5 py-3 font-bold text-sm shadow-inner"
                placeholder="Masukkan rekomendasi kampus atau jurusan dari psikolog..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pilihan Prioritas</label>
                <button
                  onClick={() => setStudiFormData({ ...studiFormData, pilihan: [...studiFormData.pilihan, { kampus: '', jurusan: '' }] })}
                  className="text-emerald-600 font-black text-[10px] flex items-center gap-1 bg-emerald-50 px-3 py-2 rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <IonIcon icon={addOutline} /> TAMBAH KAMPUS
                </button>
              </div>

              {studiFormData.pilihan.map((p, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 relative shadow-sm animate__animated animate__fadeInUp">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Pilihan Ke-{idx + 1}</p>
                    {studiFormData.pilihan.length > 1 && (
                      <button
                        onClick={() => setStudiFormData({ ...studiFormData, pilihan: studiFormData.pilihan.filter((_, i) => i !== idx) })}
                        className="text-rose-500 p-2 bg-rose-50 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl px-5 py-2 border border-transparent focus-within:border-emerald-200 transition-all">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Nama Perguruan Tinggi</p>
                      <IonInput
                        value={p.kampus}
                        onIonInput={(e) => {
                          const newP = [...studiFormData.pilihan];
                          newP[idx].kampus = e.detail.value!;
                          setStudiFormData({ ...studiFormData, pilihan: newP });
                        }}
                        className="font-black text-sm"
                        placeholder="Contoh: Universitas Indonesia"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-5 py-2 border border-transparent focus-within:border-emerald-200 transition-all">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Program Studi / Jurusan</p>
                      <IonInput
                        value={p.jurusan}
                        onIonInput={(e) => {
                          const newP = [...studiFormData.pilihan];
                          newP[idx].jurusan = e.detail.value!;
                          setStudiFormData({ ...studiFormData, pilihan: newP });
                        }}
                        className="font-black text-sm"
                        placeholder="Contoh: Teknik Informatika"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <IonButton expand="block" fill="outline" className="font-black h-14" style={{ '--border-radius': '1.5rem', '--border-width': '2px' }} onClick={() => setShowEditStudiModal(false)}>BATAL</IonButton>
              <IonButton expand="block" className="font-black h-14" style={{ '--border-radius': '1.5rem', '--background': '#10b981' }} onClick={() => { setShowEditStudiModal(false); present({ message: 'Rencana studi berhasil diperbarui', duration: 1500, color: 'success' }) }}>SIMPAN</IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* 2. MODAL EDIT IMPIAN/CITA-CITA */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--padding-top': '12px' }}>
            <IonTitle className="font-black text-gray-800">EDIT IMPIAN</IonTitle>
            <IonButtons slot="end"><IonButton onClick={() => setShowEditModal(false)}><IonIcon icon={closeOutline} style={{ fontSize: '28px' }} /></IonButton></IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="space-y-4 max-w-lg mx-auto pb-12">
            <ModernInput id="hobi" label="Hobi Utama" name="hobi" value={formData.hobi} onUpdate={(v: any) => setFormData({ ...formData, hobi: v })} />
            <ModernInput id="rumusan" label="Rumusan Cita-Cita" name="rumusan" value={formData.rumusan} isArea onUpdate={(v: any) => setFormData({ ...formData, rumusan: v })} />
            <ModernInput id="alasan" label="Alasan / Motivasi Strategis" name="alasan" value={formData.alasan} isArea onUpdate={(v: any) => setFormData({ ...formData, alasan: v })} />
            <ModernInput id="jurusan" label="Target Jurusan Impian" name="jurusan" value={formData.jurusan} onUpdate={(v: any) => setFormData({ ...formData, jurusan: v })} />
            <ModernInput id="pendukung" label="Faktor Pendukung / Potensi" name="pendukung" value={formData.pedukung} onUpdate={(v: any) => setFormData({ ...formData, pedukung: v })} />
            <ModernInput id="penghambat" label="Faktor Penghambat / Tantangan" name="penghambat" value={formData.penghambat} onUpdate={(v: any) => setFormData({ ...formData, penghambat: v })} />

            <IonButton expand="block" className="mt-8 font-black h-16" style={{ '--border-radius': '1.5rem', '--background': '#10b981' }} onClick={handleUpdateCitaCita} disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" /> : <IonIcon icon={saveOutline} slot="start" />}
              {saving ? 'PROSES MENYIMPAN...' : 'SIMPAN SEMUA PERUBAHAN'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* 3. MODAL DETAIL (DYNAMIC CONTENT) */}
      <IonModal isOpen={showDetailModal} onDidDismiss={() => setShowDetailModal(false)}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--padding-top': '12px' }}>
            <IonTitle className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-600">
              {modalType === 'rencana' ? 'Detail Target Belajar' : modalType === 'capaian' ? 'Laporan Realisasi' : modalType === 'psikologi' ? 'Analisis Psikologi' : 'Hasil Placement'}
            </IonTitle>
            <IonButtons slot="end"><IonButton onClick={() => setShowDetailModal(false)}><IonIcon icon={closeOutline} style={{ fontSize: '28px' }} /></IonButton></IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="bg-white p-6 rounded-[2rem] mb-6 shadow-sm flex justify-between items-center border border-emerald-100">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Petugas Penilai</p>
              <p className="text-base font-black text-gray-800 uppercase tracking-tight">{detailData?.info.NAMA_PENGASUH || detailData?.info.NAMA_PENGUJI || detailData?.info.NAMA_PSIOLOG || 'Staff Terkait'}</p>
            </div>
            <button onClick={handlePrint} className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-90 transition-all">
              <IonIcon icon={printOutline} /> CETAK
            </button>
          </div>

          {detailData?.data && (
            modalType === 'psikologi' ? (
              <div className="space-y-4">
                {detailData.data.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm animate__animated animate__fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.ASPEK || 'Komponen Analisis'}</p>
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black shadow-inner">{item.NILAI || item.SKOR || '-'}</span>
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-2xl italic text-xs text-gray-600 leading-relaxed border border-gray-100">
                      {item.KETERANGAN || item.DESKRIPSI || 'Tidak ada deskripsi detail.'}
                    </div>
                  </div>
                ))}
              </div>
            ) : modalType === 'placement' && Array.isArray(detailData.data) ? (
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 font-black text-gray-400 uppercase text-[9px]">
                    <tr>
                      <th className="p-5 tracking-widest">Dimensi / Standar</th>
                      <th className="p-5 text-center tracking-widest">Skor</th>
                      <th className="p-5 text-center tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detailData.data.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-5 font-bold text-gray-700">
                          <div className="text-[9px] text-gray-400 uppercase mb-1">{item.DIMENSI}</div>
                          <div className="text-sm font-black text-gray-800">{item.SUB_DIMENSI || item.STANDAR_INPUT}</div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl font-black shadow-inner">{item.HASIL ?? '-'}</span>
                        </td>
                        <td className="p-5 text-center">
                          {item.MEMENUHI === '1' ?
                            <span className="text-emerald-500 font-black text-[10px] uppercase bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Lulus</span> :
                            <span className="text-rose-500 font-black text-[10px] uppercase bg-rose-50 px-2 py-1 rounded-md border border-rose-100">Kurang</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Handle RENCANA dan CAPAIAN (Grouped by Dimension)
              Object.entries(detailData.data || {}).map(([dimensi, content]: [string, any], dIdx) => (
                <div key={dimensi} className="mb-8 animate__animated animate__fadeInUp" style={{ animationDelay: `${dIdx * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-4 ml-3">
                    <div className="w-2.5 h-8 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter">{dimensi}</h3>
                  </div>
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/80 font-black text-gray-400 uppercase text-[9px] tracking-widest">
                        <tr>
                          <th className="p-5 min-w-[200px]">Uraian Perencanaan</th>
                          <th className="p-5 text-center">Target</th>
                          {modalType === 'capaian' && <th className="p-5 text-center bg-emerald-50/30">Realisasi</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {(content.main || []).map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                            <td className="p-5 font-bold text-gray-700 leading-snug">
                              {item.PERENCANAAN_BELAJAR || item.SUB_DIMENSI || item.URAIAN || 'Data tidak tersedia'}
                            </td>
                            <td className="p-5 text-center">
                              <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-black shadow-inner">
                                {item.NILAI_TARGET ?? item.TARGET ?? '-'}
                              </span>
                            </td>
                            {modalType === 'capaian' && (
                              <td className="p-5 text-center">
                                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-black shadow-inner">
                                  {item.NILAI_REALISASI ?? item.NILAI_CAPAIAN ?? '-'}
                                </span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

// --- HELPER COMPONENTS ---

const SectionBox: React.FC<{ icon: any, title: string, children: React.ReactNode, color: string }> = ({ icon, title, children, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className={`flex items-center gap-2 mb-6 text-${color}-600`}>
      <IonIcon icon={icon} style={{ fontSize: '20px' }} />
      <span className="text-xs font-black uppercase tracking-[0.2em]">{title}</span>
    </div>
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{label}</p>
    <p className="text-base font-bold text-gray-800 leading-tight">{value || '-'}</p>
  </div>
);

const ParentMiniCard: React.FC<{ label: string, name: string, job: string, icon: any }> = ({ label, name, job, icon }) => (
  <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 shadow-inner">
    <div className="flex items-center gap-2 mb-3">
      <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm border border-blue-50">
        <IonIcon icon={icon} style={{ fontSize: '14px' }} />
      </div>
      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm font-black text-gray-800 truncate uppercase leading-tight">{name || '-'}</p>
    <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">{job || '-'}</p>
  </div>
);

const MiniTable: React.FC<{ label: string, icon: any, value: string, color: string }> = ({ label, icon, value, color }) => (
  <div className="bg-gray-50/50 p-5 rounded-[1.5rem] border border-gray-100 shadow-inner">
    <div className={`flex items-center gap-2 mb-2 text-${color}-500`}>
      <IonIcon icon={icon} style={{ fontSize: '16px' }} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xs font-black text-gray-800 uppercase leading-snug">{value || '-'}</p>
  </div>
);

const ModernInput: React.FC<any> = ({ id, label, value, onUpdate, isArea }) => (
  <div className="bg-white p-5 rounded-[1.8rem] border border-gray-100 shadow-sm focus-within:border-emerald-200 transition-all">
    <label htmlFor={id} className="text-[10px] font-black text-emerald-600 uppercase mb-3 block tracking-widest">{label}</label>
    {isArea ? (
      <IonTextarea
        value={value}
        onIonInput={(e) => onUpdate(e.detail.value!)}
        rows={4}
        className="font-bold text-base bg-gray-50/50 rounded-xl px-4 py-2"
        placeholder={`Tuliskan ${label.toLowerCase()}...`}
      />
    ) : (
      <IonInput
        value={value}
        onIonInput={(e) => onUpdate(e.detail.value!)}
        className="font-bold text-base bg-gray-50/50 rounded-xl px-4"
        placeholder={`Isi ${label.toLowerCase()}...`}
      />
    )}
  </div>
);

export default RencanaBelajarPage;