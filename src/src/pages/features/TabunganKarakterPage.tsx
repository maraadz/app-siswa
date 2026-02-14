
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { WalletIcon, TrendingUpIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
export default function TabunganKarakterPage() {
  const { user } = useAuthStore();
  const isSMA = [5].includes(Number(user?.idsatuan || user?.IDSATUAN));
  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      width: '20%'
    },
    {
      key: 'kegiatan',
      label: 'Kegiatan',
      width: '50%'
    },
    {
      key: 'poin',
      label: 'Poin',
      width: '15%'
    },
    {
      key: 'total',
      label: 'Total',
      width: '15%'
    }];

  const data = [
    {
      tanggal: '22 Jan 2024',
      kegiatan: 'Membantu teman',
      poin: '+10',
      total: '250'
    },
    {
      tanggal: '20 Jan 2024',
      kegiatan: 'Datang tepat waktu',
      poin: '+5',
      total: '240'
    },
    {
      tanggal: '18 Jan 2024',
      kegiatan: 'Menjaga kebersihan kelas',
      poin: '+8',
      total: '235'
    },
    {
      tanggal: '15 Jan 2024',
      kegiatan: 'Terlambat',
      poin: '-5',
      total: '227'
    }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Jika SMA, balik ke menu Kepengasuhan, jika bukan balik ke Home */}
      <BackButton to={isSMA ? "/features/kepengasuhan" : "/"} />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">
          Tabungan Karakter
        </h1>
        <p className="text-gray-500 text-sm font-medium">Catatan poin kedisiplinan dan adab ananda</p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Poin Karakter</p>
            <p className="text-5xl font-bold">250</p>
          </div>
          <WalletIcon className="w-16 h-16 opacity-80" />
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl inline-flex">
          <TrendingUpIcon className="w-4 h-4" />
          <span className="text-sm font-medium">+15 poin bulan ini</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Level Karakter
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm font-medium text-gray-700">
            Level 5: Teladan
          </span>
          <span className="text-sm text-gray-600">250 / 300 poin</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all"
            style={{
              width: '83%'
            }}>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          50 poin lagi untuk mencapai Level 6: Inspirasi
        </p>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs font-medium text-gray-700">Siswa Teladan</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-xs font-medium text-gray-700">Rajin Hadir</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl mb-2">🤝</div>
            <p className="text-xs font-medium text-gray-700">Penolong</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-xs font-medium text-gray-700">Rajin Belajar</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Riwayat Poin
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>);

}