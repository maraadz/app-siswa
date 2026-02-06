import { useEffect, useState, useCallback } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { useFilterStore } from '../../store/filterStore';
import { getRekapDimensi } from '../../services/dimensiService';
import { Loader2, AlertCircle, ChevronDown } from 'lucide-react';

export default function AgamisPage() {
  const { activeThn, activeSmt, setFilter } = useFilterStore();

  const [loading, setLoading] = useState(false);
  const [rekapData, setRekapData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Kolom Tabel: Elemen, Kompetensi, Nilai
  const columns = [
    { key: 'elemen', label: 'Elemen', width: '15%' },
    { key: 'kompetensi', label: 'Kompetensi', width: '70%' },
    { key: 'nilai', label: 'Nilai', width: '15%' }
  ];

  const fetchData = useCallback(async () => {
    if (!activeThn || !activeSmt) return;

    setLoading(true);
    setError(null);
    try {
      // API Dimensi Religius menggunakan ID 1
      const res = await getRekapDimensi(activeThn, activeSmt, 1);

      if (res.status === 'ok') {
        const { data } = res;
        const daftarSKL = data.skl || [];
        const nilaiSiswa = data.nilai && data.nilai.length > 0 ? data.nilai[0].skl : [];

        const mapped = daftarSKL.map((s: any) => {
          const pencapaian = nilaiSiswa.find((n: any) => String(n.id_skl) === String(s.id_skl));

          let displayNilai = '-';
          if (pencapaian && pencapaian.nilai) {
            displayNilai = Array.isArray(pencapaian.nilai)
              ? pencapaian.nilai[pencapaian.nilai.length - 1]
              : pencapaian.nilai;
          }

          return {
            elemen: 'Religius',
            kompetensi: s.nama_skl,
            nilai: displayNilai
          };
        });

        setRekapData(mapped);
      } else {
        setError("Gagal memuat data dari server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.messages?.error || "Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  }, [activeThn, activeSmt]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header Hijau */}
      <div className="bg-[#064E3B] text-white pt-6 pb-12 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {/* Menghapus prop color karena menyebabkan error TS */}
          <BackButton to="/" />
          <h1 className="text-xl font-bold">Religius</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-10">
        {/* Card Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Capaian Hasil Belajar</h2>
          <p className="text-gray-400 text-sm mb-6">Pilih semester kemudian klik tampilkan.</p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:flex-1">
              <select
                value={activeSmt}
                onChange={(e) => setFilter(activeThn, e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-600 outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="1">Semester Ganjil</option>
                <option value="2">Semester Genap</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full sm:w-auto bg-[#064E3B] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-emerald-900 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Tampilkan"}
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {error && (
            <div className="m-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Mengambil Data...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={rekapData}
              // Menghapus headerClassName karena menyebabkan error TS
              emptyMessage="Pilih semester dan klik Tampilkan untuk melihat data."
            />
          )}
        </div>
      </div>
    </div>
  );
}