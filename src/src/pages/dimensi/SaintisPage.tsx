import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { useFilterStore } from '../../store/filterStore'; // Gunakan ini untuk activeThn/activeSmt
import { useAuthStore } from '../../store/authStore';
import { getRekapDimensi } from '../../services/dimensiService'; // Path yang benar
import { Loader2, ChevronDown, RefreshCw } from 'lucide-react';

export default function SaintisPage() {
  const { activeThn, activeSmt, setFilter } = useFilterStore();
  const { warnaSatuan, user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'hasil' | 'project'>('hasil');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<{ skl: any[], nilai: any[] }>({ skl: [], nilai: [] });

  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || !activeThn) return;

    setLoading(true);
    setError(null);

    try {
      // ID Dimensi Saintis adalah 4
      const res = await getRekapDimensi(activeThn, activeSmt, 4);

      if (!isMounted.current) return;

      if (res && res.status === 'ok') {
        const sklList = res.skl || res.data?.skl || [];
        const nilaiSiswa = res.nilai?.[0]?.SKL || res.data?.nilai?.[0]?.skl || [];

        setRawData({ skl: sklList, nilai: nilaiSiswa });

        // SINKRONISASI: Hitung data yang ada nilainya untuk radar Home
        const count = nilaiSiswa.filter((n: any) => {
          const val = n.NILAI || n.nilai;
          return val && val !== "" && val !== "-";
        }).length;

        localStorage.setItem(`last_cnt_saintis_${user.id}`, count.toString());
      }
    } catch (err) {
      if (isMounted.current) setError("Gagal sinkronisasi data Saintis.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [isAuthenticated, user, activeThn, activeSmt]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => { isMounted.current = false; };
  }, [fetchData]);

  // Transformasi data untuk tabel
  const processedData = useMemo(() => {
    const merged = rawData.skl.map(s => {
      const matchNilai = rawData.nilai.find(v => String(v.IDSKL || v.id_skl) === String(s.IDSKL || s.id_skl));
      let displayNilai = '-';
      if (matchNilai) {
        const rawNilai = matchNilai.NILAI || matchNilai.nilai;
        displayNilai = Array.isArray(rawNilai) ? rawNilai[rawNilai.length - 1] : rawNilai;
      }

      return {
        pelajaran: s.PELAJARAN || 'Sains',
        materi: s.SKL || s.nama_skl || '-',
        nilai: displayNilai,
        // Logika filter: Jika nama pelajaran mengandung kata 'project' atau tipe tertentu
        isProject: (s.PELAJARAN || '').toLowerCase().includes('project') || s.TIPE_PENILAIAN === "30"
      };
    });

    return {
      hasil: merged.filter(item => !item.isProject && item.nilai !== '-'),
      project: merged.filter(item => item.isProject && item.nilai !== '-')
    };
  }, [rawData]);

  const columns = [
    { key: 'pelajaran', label: 'Kategori', width: '30%' },
    { key: 'materi', label: 'Materi/Project', width: '55%' },
    { key: 'nilai', label: 'Nilai', width: '15%' }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <header className="text-white pt-6 pb-12 px-4 shadow-md" style={{ backgroundColor: warnaSatuan }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <BackButton to="/" />
          <h1 className="text-xl font-bold">Dimensi Saintis</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-10">
        {/* Filter Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Semester</label>
              <div className="relative mt-1">
                <select
                  value={activeSmt}
                  onChange={(e) => setFilter(activeThn, e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-bold outline-none"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full sm:w-auto text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: warnaSatuan }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={18} />}
              Tampilkan Data
            </button>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('hasil')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'hasil' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Capaian Belajar
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'project' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            My Project
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold border-b border-red-100">⚠️ {error}</div>}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin mb-4" style={{ color: warnaSatuan }} size={40} />
              <p className="text-gray-400 text-xs font-bold uppercase">Memuat Data Saintis...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={activeTab === 'hasil' ? processedData.hasil : processedData.project}
              emptyMessage={`Belum ada data ${activeTab === 'hasil' ? 'capaian' : 'project'}.`}
            />
          )}
        </div>
      </main>
    </div>
  );
}