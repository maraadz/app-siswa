import { useEffect, useState, useCallback, useRef } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { useFilterStore } from '../../store/filterStore';
import { useAuthStore } from '../../store/authStore';
import { getRekapDimensi } from '../../services/dimensiService';
import { Loader2, ChevronDown, RefreshCw } from 'lucide-react';

export default function AgamisPage() {
  const { activeThn, activeSmt, setFilter } = useFilterStore();
  const { warnaSatuan, user, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [rekapData, setRekapData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  const columns = [
    { key: 'elemen', label: 'Elemen', width: '25%' },
    { key: 'kompetensi', label: 'Kompetensi', width: '60%' },
    { key: 'nilai', label: 'Nilai', width: '15%' }
  ];

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || !activeThn) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getRekapDimensi(activeThn, activeSmt, 1);

      if (!isMounted.current) return;

      if (res && res.status === 'ok') {
        // Normalisasi path data agar sama dengan Radar Home
        const masterSKL = res.skl || res.data?.skl || [];
        const nilaiSiswa = res.nilai?.[0]?.SKL || res.data?.nilai?.[0]?.skl || [];

        const mapped = masterSKL.map((m: any) => {
          const matchNilai = nilaiSiswa.find((n: any) => String(n.IDSKL || n.id_skl) === String(m.IDSKL || m.id_skl));
          let displayNilai = '-';
          if (matchNilai) {
            const rawNilai = matchNilai.NILAI || matchNilai.nilai;
            displayNilai = Array.isArray(rawNilai) ? rawNilai[rawNilai.length - 1] : rawNilai;
          }
          return {
            elemen: m.SUB_ELEMEN || m.PELAJARAN || 'Religius',
            kompetensi: m.SKL || m.nama_skl || '-',
            nilai: displayNilai
          };
        });

        const finalData = mapped.filter((item: any) => item.nilai !== '-' && item.nilai !== '');

        // SINKRONISASI: Update storage agar HomePage tahu data sudah "dibaca"
        const storageKey = `last_cnt_agamis_${user?.id}`;
        localStorage.setItem(storageKey, finalData.length.toString());

        setRekapData(finalData);
      }
    } catch (err: any) {
      if (isMounted.current) setError("Gagal sinkronisasi data Agamis.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [isAuthenticated, user, activeThn, activeSmt]);

  useEffect(() => {
    isMounted.current = true;
    if (activeThn && isAuthenticated) fetchData();
    return () => { isMounted.current = false; };
  }, [activeThn, activeSmt, fetchData, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <header className="text-white pt-6 pb-12 px-4 shadow-md" style={{ backgroundColor: warnaSatuan }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <BackButton to="/" />
          <h1 className="text-xl font-bold">Dimensi Religius</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-10">
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Semester Aktif</label>
              <div className="relative mt-1">
                <select
                  value={activeSmt}
                  onChange={(e) => setFilter(activeThn, e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-bold outline-none focus:ring-2"
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

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* TAMBAHKAN INI: Agar variabel 'error' terbaca */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold border-b border-red-100">
              ⚠️ {error}
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin mb-4" style={{ color: warnaSatuan }} size={40} />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sinkronisasi...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={rekapData} emptyMessage="Belum ada rekapan nilai Agamis." />
          )}
        </div>
      </main>
    </div>
  );
}