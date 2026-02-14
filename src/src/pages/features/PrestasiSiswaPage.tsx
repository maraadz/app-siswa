import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { TrophyIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
export default function PrestasiSiswaPage() {
  const { user } = useAuthStore();
  const isSMA = [5].includes(Number(user?.idsatuan || user?.IDSATUAN));
  const columns = [
    {
      key: 'nama',
      label: 'Nama Siswa',
      width: '30%'
    },
    {
      key: 'prestasi',
      label: 'Prestasi',
      width: '40%'
    },
    {
      key: 'tingkat',
      label: 'Tingkat',
      width: '15%'
    },
    {
      key: 'tahun',
      label: 'Tahun',
      width: '15%'
    }];

  const data = [
    {
      nama: 'Ahmad Fauzi',
      prestasi: 'Juara 1 Olimpiade Matematika',
      tingkat: 'Provinsi',
      tahun: '2024'
    },
    {
      nama: 'Fatimah Zahra',
      prestasi: 'Juara 2 Lomba Tahfidz',
      tingkat: 'Nasional',
      tahun: '2024'
    },
    {
      nama: 'Muhammad Ali',
      prestasi: 'Juara 3 Olimpiade Fisika',
      tingkat: 'Kota',
      tahun: '2023'
    },
    {
      nama: 'Aisyah Nur',
      prestasi: 'Juara 1 Lomba Pidato Bahasa Arab',
      tingkat: 'Provinsi',
      tahun: '2023'
    }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {isSMA ? "Tabungan Prestasi" : "Prestasi Siswa"}
        </h1>
        <p className="text-gray-600">Capaian dan penghargaan siswa</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white">
          <TrophyIcon className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold mb-1">24</p>
          <p className="text-sm opacity-90">Total Prestasi 2024</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
          <TrophyIcon className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-sm opacity-90">Tingkat Nasional</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white">
          <TrophyIcon className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold mb-1">16</p>
          <p className="text-sm opacity-90">Tingkat Provinsi</p>
        </div>
      </div>

      {/* Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Daftar Prestasi
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>);

}