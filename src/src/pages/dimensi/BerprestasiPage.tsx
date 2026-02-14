import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { useFilterStore } from '../../store/filterStore';
import { useAuthStore } from '../../store/authStore';
import { getRekapDimensi } from '../../services/dimensiService';
import { Loader2, ChevronDown, RefreshCw, Trophy, Medal, Star, AlertCircle } from 'lucide-react';

export default function BerprestasiPage() {
  const { activeThn, activeSmt, setFilter } = useFilterStore();
  const { warnaSatuan, user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'ekskul' | 'olimpiade' | 'kejuaraan'>('ekskul');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<{ skl: any[], nilai: any[] }>({ skl: [], nilai: [] });

  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || !activeThn) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getRekapDimensi(activeThn, activeSmt, 6);
      if (!isMounted.current) return;

      if (res && res.status === 'ok') {
        const sklList = res.skl || [];
        const nilaiSiswa = res.nilai?.[0]?.SKL || [];
        setRawData({ skl: sklList, nilai: nilaiSiswa });

        const count = nilaiSiswa.filter((n: any) => {
          const val = n.NILAI || n.nilai;
          return val && Array.isArray(val) && val[0] !== "" && val[0] !== "-";
        }).length;

        localStorage.setItem(`last_cnt_berprestasi_${user.id}`, count.toString());
      }
    } catch (err) {
      if (isMounted.current) setError("Gagal sinkronisasi data Prestasi.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [isAuthenticated, user, activeThn, activeSmt]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => { isMounted.current = false; };
  }, [fetchData]);

  const processedData = useMemo(() => {
    const merged = rawData.skl.map(s => {
      const matchNilai = rawData.nilai.find(v => String(v.IDSKL) === String(s.IDSKL));
      let displayNilai = '-';
      if (matchNilai) {
        const rawNilai = matchNilai.NILAI || matchNilai.nilai;
        displayNilai = Array.isArray(rawNilai) ? rawNilai[rawNilai.length - 1] : rawNilai;
      }

      const kategori = (s.KATEGORI || '').toLowerCase();
      return {
        bidang: s.PELAJARAN || 'Umum',
        materi: s.SKL || '-',
        nilai: displayNilai,
        isEkskul: kategori.includes('ekstra') || kategori.includes('wajib')
      };
    });

    return {
      ekskul: merged.filter(item => item.isEkskul && item.nilai !== '-'),
      olimpiade: merged.filter(item => !item.isEkskul && item.nilai !== '-'),
      kejuaraan: []
    };
  }, [rawData]);

  const columnsMap: Record<string, any[]> = {
    ekskul: [
      { key: 'bidang', label: 'Bidang/Ekskul', width: '30%' },
      { key: 'materi', label: 'Item Capaian', width: '55%' },
      { key: 'nilai', label: 'Nilai', width: '15%' }
    ],
    olimpiade: [
      { key: 'bidang', label: 'Olimpiade', width: '30%' },
      { key: 'materi', label: 'Materi', width: '55%' },
      { key: 'nilai', label: 'Nilai', width: '15%' }
    ],
    kejuaraan: [
      { key: 'no', label: 'No', width: '10%' },
      { key: 'prestasi', label: 'Prestasi', width: '40%' },
      { key: 'tingkat', label: 'Tingkat', width: '25%' },
      { key: 'juara', label: 'Juara', width: '25%' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <header className="text-white pt-6 pb-12 px-4 shadow-md" style={{ backgroundColor: warnaSatuan }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <BackButton to="/" />
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy size={22} /> Dimensi Berprestasi
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-10">
        {activeTab !== 'kejuaraan' && (
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
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full sm:w-auto text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: warnaSatuan }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={18} />}
                Tampilkan
              </button>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-2 mb-4 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'ekskul', label: 'Ekstrakurikuler', icon: Star },
            { id: 'olimpiade', label: 'Olimpiade', icon: Medal },
            { id: 'kejuaraan', label: 'Kejuaraan', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 flex items-center gap-2 font-bold text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <Loader2 className="animate-spin mb-4" style={{ color: warnaSatuan }} size={40} />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Memproses Data...</p>
            </div>
          ) : (
            <DataTable
              columns={columnsMap[activeTab]}
              data={processedData[activeTab as keyof typeof processedData]}
              emptyMessage={`Belum ada data ${activeTab} tersedia.`}
            />
          )}
        </div>
      </main>
    </div>
  );
}