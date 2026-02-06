import React from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { ClipboardCheckIcon } from 'lucide-react';
export default function TryOutPage() {
  const columns = [
  {
    key: 'nama',
    label: 'Nama Try Out',
    width: '40%'
  },
  {
    key: 'tanggal',
    label: 'Tanggal',
    width: '20%'
  },
  {
    key: 'status',
    label: 'Status',
    width: '20%'
  },
  {
    key: 'nilai',
    label: 'Nilai',
    width: '20%'
  }];

  const data = [
  {
    nama: 'Try Out UTBK 2024 - Sesi 1',
    tanggal: '25 Jan 2024',
    status: 'Selesai',
    nilai: '550'
  },
  {
    nama: 'Try Out UTBK 2024 - Sesi 2',
    tanggal: '1 Feb 2024',
    status: 'Tersedia',
    nilai: '-'
  },
  {
    nama: 'Try Out Ujian Sekolah',
    tanggal: '15 Feb 2024',
    status: 'Tersedia',
    nilai: '-'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Try Out</h1>
        <p className="text-gray-600">Latihan soal dan ujian</p>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <ClipboardCheckIcon className="w-10 h-10 mb-3" />
        <h3 className="text-xl font-bold mb-2">Try Out Tersedia</h3>
        <p className="text-sm opacity-90 mb-4">
          Ikuti try out untuk mengukur kemampuan dan persiapan ujian
        </p>
        <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors">
          Mulai Try Out
        </button>
      </div>

      {/* Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Daftar Try Out
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>);

}