import { useState, useEffect, useCallback } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { useFilterStore } from '../../store/filterStore';
import { useAuthStore } from '../../store/authStore';
import { getQuraniCapaian } from '../../services/dimensiService';
import {
  Play, Pause, SkipForward, SkipBack,
  Volume2, BookOpen, Music, CheckCircle2,
  User, MessageSquare, Info, AlertCircle
} from 'lucide-react';

interface QuraniPageProps {
  studentName?: string;
}

const QuraniPage: React.FC<QuraniPageProps> = ({ studentName }) => {
  const { activeThn } = useFilterStore();
  const { warnaSatuan, user } = useAuthStore();

  // State Management
  const [activeTab, setActiveTab] = useState<'capaian' | 'mufid'>('capaian');
  const [kategori, setKategori] = useState('terjemah');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataQurani, setDataQurani] = useState<any>(null);
  const [catatanOrangTua, setCatatanOrangTua] = useState('');
  const [volume, setVolume] = useState(80);
  const [showVolume, setShowVolume] = useState(false);

  // Column Definitions
  const targetColumns = [
    { key: 'no', label: 'No', width: '10%' },
    { key: 'indikator', label: 'Indikator Target', width: '90%' }
  ];

  const tercapaiColumns = [
    { key: 'no', label: 'No', width: '10%' },
    { key: 'tanggal_checked', label: 'Tanggal', width: '30%' },
    { key: 'indikator', label: 'Indikator', width: '40%' },
    { key: 'catatan', label: 'Status', width: '20%' }
  ];

  // Data Dummy Mufid
  const dummyMufid = [
    { id: 1, name: 'An-Nas', duration: '0:45' },
    { id: 2, name: 'Al-Falaq', duration: '0:52' },
    { id: 3, name: 'Al-Ikhlas', duration: '0:38' },
  ];

  const fetchCapaian = useCallback(async () => {
    if (!activeThn) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getQuraniCapaian(kategori, activeThn);

      if (res && res.status === 'ok') {
        setDataQurani(res.data);

        // --- SINKRONISASI RADAR ---
        // Update local storage agar HomePage tahu kita sudah melihat data terbaru
        // Jadi notifikasi tidak muncul berulang (spam) untuk data yang sudah dilihat
        if (kategori === 'terjemah' && user?.id) {
          const count = res.data.capaian_terpenuhi?.length || 0;
          localStorage.setItem(`last_cnt_qurani_terjemah_${user.id}`, count.toString());
        }
      } else {
        // Menggunakan setError alih-alih throw agar flow catch lebih bersih
        setError(res?.message || "Data kategori ini belum tersedia untuk tahun ajaran yang dipilih.");
        setDataQurani({
          progres_persen: 0,
          nama_guru: "N/A",
          indikator: [],
          capaian_terpenuhi: []
        });
      }
    } catch (err: any) {
      console.error("Qurani Page Error:", err);
      setError("Gagal terhubung ke server. Silahkan coba lagi nanti.");

      // Fallback data agar tabel tidak pecah/error mapping
      setDataQurani({
        progres_persen: 0,
        nama_guru: "Error Server",
        indikator: [],
        capaian_terpenuhi: []
      });
    } finally {
      setLoading(false);
    }
  }, [activeThn, kategori, user?.id]);

  useEffect(() => {
    fetchCapaian();
  }, [fetchCapaian]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Header */}
      <header className="text-white pt-8 pb-20 px-6 rounded-b-[40px] shadow-lg" style={{ backgroundColor: warnaSatuan }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <BackButton to="/" />
          <div className="text-right">
            <h1 className="text-2xl font-black italic">Dimensi Qurani</h1>
            <p className="text-sm font-bold opacity-80">{studentName}</p>
            <p className="text-xs opacity-90 font-medium">Sabilillah Qur'anic System</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-12 space-y-6">
        {/* Quote */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 text-center space-y-4">
          <p className="text-3xl font-arabic text-emerald-600 leading-loose">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
          <div className="space-y-1">
            <p className="text-gray-600 italic font-medium">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya"</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">— HR. Bukhari</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl gap-1 backdrop-blur-sm">
          {(['capaian', 'mufid'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:bg-white/50'
                }`}
            >
              {tab === 'capaian' ? <BookOpen size={18} /> : <Music size={18} />}
              {tab === 'capaian' ? 'Capaian' : 'MUFID'}
            </button>
          ))}
        </div>

        {activeTab === 'capaian' ? (
          <div className="space-y-6">
            {/* Filter Section */}
            <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Pilih Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="terjemah">📖 Capaian Terjemah</option>
                  <option value="mandiri">🧘 Capaian Mandiri</option>
                  <option value="tartil">✨ Capaian Tartil</option>
                  <option value="hafalan">🧠 Capaian Hafalan</option>
                  <option value="tahfidz">🕋 Capaian Tahfidz</option>
                </select>
              </div>
              <button
                onClick={fetchCapaian}
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                style={{ backgroundColor: warnaSatuan }}
              >
                {loading ? 'Memuat...' : 'Tampilkan'}
              </button>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Progress Card */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-4">Statistik Capaian</h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-sm font-bold text-gray-700">Persentase Target</span>
                    <span className="text-lg font-black" style={{ color: warnaSatuan }}>{dataQurani?.progres_persen || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${dataQurani?.progres_persen || 0}%`, backgroundColor: warnaSatuan }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl">
                  <User size={18} className="text-blue-600" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Pembimbing</p>
                    <p className="font-bold text-gray-800 text-sm">{dataQurani?.nama_guru || 'Belum ditentukan'}</p>
                  </div>
                </div>
              </div>

              {/* Tables */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-2 font-bold text-gray-900 text-sm italic"><Info size={16} className="text-blue-500" /> TARGET KESELURUHAN</div>
                <DataTable columns={targetColumns} data={dataQurani?.indikator || []} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-2 font-bold text-gray-900 text-sm italic"><CheckCircle2 size={16} className="text-emerald-500" /> TARGET TERCAPAI</div>
                <DataTable columns={tercapaiColumns} data={dataQurani?.capaian_terpenuhi || []} />
              </div>

              {/* Feedback */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-900"><MessageSquare size={20} className="text-orange-500" /> Catatan Orang Tua</div>
                <textarea
                  value={catatanOrangTua}
                  onChange={(e) => setCatatanOrangTua(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-sm focus:border-emerald-500 outline-none min-h-[120px]"
                />
                <button className="w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all" style={{ backgroundColor: warnaSatuan }}>Simpan Catatan</button>
              </div>
            </div>
          </div>
        ) : (
          /* MUFID SECTION */
          <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
            <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 space-y-4">
              {dummyMufid.map((surat) => (
                <div key={surat.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between group transition-all cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-white transition-all"
                      style={{ '--hover-bg': warnaSatuan } as any}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = warnaSatuan)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <Play size={16} fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Surat {surat.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{surat.duration}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Player Bar */}
              <div className="bg-gray-900 rounded-[30px] p-6 text-white space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">Playing: An-Nas</p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowVolume(!showVolume)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                      <Volume2 size={18} style={{ color: warnaSatuan }} />
                    </button>
                    {showVolume && (
                      <div className="absolute bottom-12 right-0 bg-white p-3 rounded-xl shadow-xl w-10 flex flex-col items-center animate-in zoom-in-95">
                        <input
                          type="range"
                          min="0" max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="h-20 accent-blue-600"
                          style={{ appearance: 'slider-vertical' as any, WebkitAppearance: 'slider-vertical' as any }}
                        />
                        <span className="text-[8px] font-black text-gray-900 mt-2">{volume}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <SkipBack size={20} className="opacity-50 hover:opacity-100 cursor-pointer" />
                  <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90" style={{ backgroundColor: warnaSatuan }}>
                    <Pause size={24} fill="currentColor" />
                  </button>
                  <SkipForward size={20} className="opacity-50 hover:opacity-100 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default QuraniPage;