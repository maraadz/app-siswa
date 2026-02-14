import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  getPresensiLanding,
  getPresensiBulanan,
  postTambahIzin,
  getFileIzin,
  postReadToday
} from '../../services/presensiService';

import { useNotificationStore } from '../../store/notificationStore';

import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';

import {
  Calendar,
  ClipboardCheck,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  UploadCloud,
  Eye,
  X, Download,
  FileWarning
} from 'lucide-react';

export default function PresensiPage() {
  const { user, warnaSatuan } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'rekap' | 'form' | 'status'>('rekap');
  const [loading, setLoading] = useState(true);
  const [landingData, setLandingData] = useState<any>(null);
  const [rekapItems, setRekapItems] = useState<any[]>([]);
  const [selectedBulan, setSelectedBulan] = useState('');

  // component notif
  const playVoiceNotification = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkIzinStatus = (izinList: any[]) => {
    if (!user) return;

    izinList.forEach((izin) => {
      const storageKey = `izin_status_${izin.id}_${user.id}`;
      const prevStatus = localStorage.getItem(storageKey);

      if (prevStatus && prevStatus !== izin.status) {
        // Status berubah!
        if (izin.status === "Disetujui") {
          addNotification({
            title: "Izin Disetujui ✅",
            message: "Alhamdulillah, permohonan izin Anda telah disetujui.",
            type: "success"
          });

          playVoiceNotification(
            "Alhamdulillah, izin anda telah disetujui."
          );
        }

        if (izin.status === "Ditolak") {
          addNotification({
            title: "Izin Ditolak ❌",
            message: "Mohon maaf, permohonan izin belum dapat disetujui.",
            type: "update"
          });

          playVoiceNotification(
            "Mohon maaf, izin anda belum dapat disetujui."
          );
        }
      }

      // Simpan status terbaru
      localStorage.setItem(storageKey, izin.status);
    });
  };

  // component file izin
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'pdf' | 'image' | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  const handlePreviewFile = async (fileName: string) => {
    try {
      const { blob, contentType } = await getFileIzin(fileName);

      if (!contentType?.includes('pdf') && !contentType?.includes('image')) {
        setFeedback({
          type: 'error',
          message: 'File tidak valid atau gagal diambil.'
        });
        return;
      }

      const url = window.URL.createObjectURL(blob);

      if (contentType.includes('pdf')) {
        setPreviewType('pdf');
      } else if (contentType.includes('image')) {
        setPreviewType('image');
      }

      setPreviewUrl(url);
      setPreviewName(fileName);
      setPreviewOpen(true);

    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Gagal membuka file.'
      });

    }
  };


  const handleDownloadFile = async () => {
    if (!previewUrl) return;

    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = previewName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };



  const [formIzin, setFormIzin] = useState({
    jenisIzin: 'Sakit',
    startDate: '',
    endDate: '',
    keterangan: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!rekapItems || rekapItems.length === 0 || !user) return;

    const today = new Date();
    const day = today.getDay(); // 0=Sunday, 6=Saturday

    const storageKey = `holiday_notified_${user.id}_${today.toDateString()}`;
    const alreadyNotified = localStorage.getItem(storageKey);

    // Weekend otomatis
    if ((day === 0 || day === 6) && !alreadyNotified) {
      const message =
        "Alhamdulillah, hari ini libur. Selamat beristirahat dan tetap semangat menuntut ilmu, Ananda.";

      addNotification({
        title: "Happy Weekend 🎉",
        message,
        type: "info"
      });

      playVoiceNotification(
        "Happy weekend ananda. Selamat beristirahat dan tetap menjadi generasi pemimpin peradaban."
      );

      localStorage.setItem(storageKey, "true");
    }

    // Kalau mau cek dari rekapItems ada status LIBUR
    const todayItem = rekapItems.find((item: any) => item.isToday);

    if (todayItem?.status === "LIBUR" && !alreadyNotified) {
      addNotification({
        title: "Hari Libur Sekolah",
        message:
          "Hari ini tidak ada kegiatan belajar. Gunakan waktu untuk ibadah dan berkumpul bersama keluarga.",
        type: "info"
      });

      playVoiceNotification(
        "Hari ini adalah hari libur sekolah. Gunakan waktu dengan hal yang bermanfaat."
      );

      localStorage.setItem(storageKey, "true");
    }

  }, [rekapItems, user]);

  useEffect(() => {
    if (user?.nis) {
      loadLanding();
      postReadToday(user.nis).catch(console.error);
    }
  }, [user]);

  const loadLanding = async () => {
    try {
      setLoading(true);
      const res = await getPresensiLanding(user!.nis);
      if (res.status === 'ok') {
        setLandingData(res.data);
        checkIzinStatus(res.data?.izin || []);
        const bulanList = res.data.bulan;

        if (bulanList && bulanList.length > 0) {
          const now = new Date();
          const currentRealMonth = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
          const foundBulan = bulanList.find((b: any) => b.label.toLowerCase() === currentRealMonth.toLowerCase());
          const defaultBulan = foundBulan ? foundBulan.label : bulanList[bulanList.length - 1].label;

          setSelectedBulan(defaultBulan);
          loadRekap(defaultBulan);
        }
      }
    } catch (err) {
      console.error("Gagal load landing:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRekap = async (bulanLabel: string) => {
    try {
      const res = await getPresensiBulanan(user!.nis, bulanLabel);
      if (res.status === 'ok') {
        setRekapItems(res.data.items || []);
      }
    } catch (err) {
      console.error("Gagal load rekap:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);

    if (selectedFile) {
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (selectedFile.size > maxSize) {
        setFileError("Ukuran file terlalu besar (Maksimal 3MB)");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleKirimIzin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFeedback({
        type: 'error',
        message: 'Mohon lampirkan surat izin (Maks. 3MB).'
      });
      return;
    }

    const formData = new FormData();
    formData.append('nis', user!.nis);
    formData.append('jenisIzin', formIzin.jenisIzin);
    formData.append('startDate', formIzin.startDate);
    formData.append('endDate', formIzin.endDate || formIzin.startDate);
    formData.append('keterangan', formIzin.keterangan);
    formData.append('file', file);

    try {
      const res = await postTambahIzin(formData);
      if (res.status === 'ok') {
        setFeedback({
          type: 'success',
          message: 'Permohonan izin berhasil dikirim.'
        });
        setActiveTab('status');
        loadLanding();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Gagal mengirim data. Cek koneksi atau ukuran file.'
      });
    }
  };

  // --- LOGIKA REKAP ---
  const columnsRekap = [
    {
      key: 'tanggal_label',
      label: 'Tanggal',
      width: '40%',
      render: (val: string, item: any) => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const isToday = item.tanggal_iso === todayStr;

        return (
          <div className="flex flex-col">
            <span className={`text-sm ${isToday ? "font-black text-gray-900" : "text-gray-600"}`}>{val}</span>
            {isToday && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-md mt-1 w-fit uppercase"
                style={{ backgroundColor: `${warnaSatuan}20`, color: warnaSatuan }}
              >
                Hari Ini
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'waktu',
      label: 'Waktu',
      width: '30%',
      render: (val: string, item: any) => {
        // Normalisasi status untuk pengecekan waktu
        const s = item.status ? String(item.status).toLowerCase().trim() : "";

        // Jika status mengandung kata libur, tidak hadir, atau alpa, tampilkan strip
        if (s.includes('libur') || s.includes('tidak') || s === 'alpa' || s === 'a') {
          return <span className="text-gray-300">-</span>;
        }
        return <span className="text-gray-700 font-medium">{val || "-"}</span>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '30%',
      render: (val: any, item: any) => {
        const s = val ? String(val).toLowerCase().trim() : "";

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const isToday = item.tanggal_iso === todayStr;

        // ✅ HADIR → centang saja
        if (s === 'hadir' || s === 'h') {
          return (
            <span
              className={`text-lg font-black ${isToday ? 'text-green-700' : 'text-green-500'}`}
            >
              ✓
            </span>
          );
        }

        // ❌ TIDAK HADIR / ALPA → strip
        if (s.includes('tidak') || s === 'alpa' || s === 'a') {
          return (
            <span
              className={`text-lg font-black ${isToday ? 'text-red-700' : 'text-gray-400'}`}
            >
              -
            </span>
          );
        }

        // LIBUR → kosongkan saja
        if (s.includes('libur')) {
          return (
            <span className="text-gray-300 font-bold">
              -
            </span>
          );
        }

        // IZIN / SAKIT → boleh tetap tampil I
        if (s.includes('sakit') || s.includes('izin')) {
          return (
            <span className="text-orange-500 font-bold">
              I
            </span>
          );
        }

        return <span className="text-gray-300">-</span>;
      }
    }
  ];

  // --- LOGIKA TAB STATUS IZIN ---
  const columnsIzin = (isSelesai: boolean) => {
    const cols = [
      { key: 'TGL_MULAI', label: 'Mulai', width: '20%' },
      { key: 'TGL_AKHIR', label: 'Selesai', width: '20%' },
      { key: 'KETERANGAN', label: 'Ket', width: '30%' },
      {
        key: 'SURAT_IZIN',
        label: 'File',
        width: '15%',
        render: (val: string) => {
          if (!val) return <span className="text-gray-300">-</span>;
          return (
            <button
              type="button"
              onClick={() => handlePreviewFile(val)}
              className="flex items-center justify-center bg-blue-50 text-blue-600 p-2 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Eye className="w-4 h-4" />
            </button>
          );
        }
      }
    ];

    if (isSelesai) {
      cols.push({ key: 'CATATAN', label: 'Catatan', width: '15%' } as any);
    }

    cols.push({
      key: 'STATUS',
      label: 'Status',
      width: '15%',
      render: (val: any) => {
        const statusConfig: any = {
          1: { label: 'PROSES', color: 'bg-orange-500', icon: <Clock className="w-3 h-3" /> },
          2: { label: 'DISETUJUI', color: 'bg-green-600', icon: <CheckCircle className="w-3 h-3" /> },
          3: { label: 'DITOLAK', color: 'bg-red-600', icon: <XCircle className="w-3 h-3" /> },
        };
        const cfg = statusConfig[val] || { label: 'WAITING', color: 'bg-gray-400', icon: null };
        return (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] text-white font-black shadow-sm ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </div>
        );
      }
    } as any);

    return cols;
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-gray-400 uppercase text-xs tracking-widest">Memuat Data Presensi...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
      <BackButton to="/" />

      <div className="mb-6 flex justify-between items-end mt-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none italic uppercase tracking-tighter">Presensi Siswa</h1>
          <p className="text-gray-500 text-sm mt-2">
            Tahun Ajaran <span className="font-bold text-gray-700">{landingData?.tahun_ajaran_aktif?.TAHUN_AJARAN}</span>
          </p>
        </div>
        <Calendar className="w-10 h-10 opacity-10" />
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-[24px] mb-6">
        {[
          { id: 'rekap', label: 'Rekap', icon: ClipboardCheck },
          { id: 'form', label: 'Ajukan Izin', icon: FileText },
          { id: 'status', label: 'Status Izin', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white shadow-md' : 'text-gray-500'}`}
            style={activeTab === tab.id ? { color: warnaSatuan } : {}}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'rekap' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bulan:</label>
            <select
              value={selectedBulan}
              onChange={(e) => { setSelectedBulan(e.target.value); loadRekap(e.target.value); }}
              className="flex-1 bg-transparent font-black outline-none text-sm"
              style={{ color: warnaSatuan }}
            >
              {landingData?.bulan.map((b: any) => (
                <option key={b.key} value={b.label}>{b.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
            <DataTable columns={columnsRekap} data={rekapItems} />
          </div>
        </div>
      )}

      {activeTab === 'form' && (
        <form onSubmit={handleKirimIzin} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
          <h3 className="font-black text-lg uppercase italic tracking-tight">Permohonan Izin Baru</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Jenis Izin</label>
              <select
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none"
                value={formIzin.jenisIzin}
                onChange={e => setFormIzin({ ...formIzin, jenisIzin: e.target.value })}
              >
                <option>Sakit</option>
                <option>Izin</option>
                <option>Dispensasi</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">Mulai</label>
              <input type="date" className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none"
                onChange={e => setFormIzin({ ...formIzin, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">Selesai</label>
              <input type="date" className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none"
                onChange={e => setFormIzin({ ...formIzin, endDate: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Keterangan Alasan</label>
              <textarea className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none resize-none" rows={3}
                placeholder="Contoh: Sakit demam disertai pusing..."
                onChange={e => setFormIzin({ ...formIzin, keterangan: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Lampiran Surat (Maks 3MB)</label>
              {fileError && (
                <div className="mb-2 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 animate-bounce">
                  <FileWarning className="w-4 h-4" />
                  <span className="text-xs font-bold">{fileError}</span>
                </div>
              )}
              <div className={`mt-1 border-2 border-dashed rounded-3xl p-8 text-center transition-all ${fileError ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="file" id="fileIzin" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                <label htmlFor="fileIzin" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className={`w-12 h-12 mb-2 ${fileError ? 'text-red-300' : 'text-gray-300'}`} />
                  <span className={`text-sm font-bold ${fileError ? 'text-red-500' : 'text-gray-500'}`}>
                    {file ? file.name : 'Klik untuk Unggah / Foto Surat'}
                  </span>
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-5 rounded-[24px] text-white font-black shadow-lg active:scale-95 transition-transform"
            style={{ backgroundColor: warnaSatuan }}>
            KIRIM PERMOHONAN
          </button>
        </form>
      )}

      {activeTab === 'status' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <section>
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Dalam Antrian Verifikasi
            </h4>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <DataTable columns={columnsIzin(false)} data={landingData?.izin?.proses || []} emptyMessage="Tidak ada izin yang diproses" />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" /> Riwayat Keputusan
            </h4>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <DataTable columns={columnsIzin(true)} data={landingData?.izin?.selesai || []} emptyMessage="Belum ada riwayat izin" />
            </div>
          </section>
        </div>
      )}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-black text-sm truncate">{previewName}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadFile}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setPreviewOpen(false);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 max-h-[75vh] overflow-auto flex justify-center">
              {previewType === 'pdf' && previewUrl && (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh] rounded-xl"
                />
              )}

              {previewType === 'image' && previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[70vh] rounded-xl"
                />
              )}

              {!previewType && (
                <p className="text-gray-400 text-sm">File tidak dapat dipreview</p>
              )}
            </div>

          </div>
        </div>
      )}
      {feedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">

            <div className="flex flex-col items-center text-center space-y-4">

              {feedback.type === 'success' ? (
                <CheckCircle
                  className="w-14 h-14"
                  style={{ color: warnaSatuan }}
                />
              ) : (
                <XCircle className="w-14 h-14 text-red-500" />
              )}

              <h3 className="font-black text-lg">
                {feedback.type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}
              </h3>

              <p className="text-sm text-gray-500">
                {feedback.message}
              </p>

              <button
                onClick={() => setFeedback(null)}
                className="w-full py-3 rounded-2xl font-black text-white transition active:scale-95"
                style={{
                  backgroundColor:
                    feedback.type === 'success' ? warnaSatuan : '#ef4444'
                }}
              >
                OK
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}