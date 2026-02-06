import React from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function KehadiranSiswaPage() {
  const columns = [
  {
    key: 'tanggal',
    label: 'Tanggal',
    width: '25%'
  },
  {
    key: 'status',
    label: 'Status',
    width: '25%'
  },
  {
    key: 'waktu',
    label: 'Waktu',
    width: '25%'
  },
  {
    key: 'keterangan',
    label: 'Keterangan',
    width: '25%'
  }];

  const data = [
  {
    tanggal: '22 Jan 2024',
    status: 'Hadir',
    waktu: '06:55',
    keterangan: '-'
  },
  {
    tanggal: '21 Jan 2024',
    status: 'Hadir',
    waktu: '07:02',
    keterangan: '-'
  },
  {
    tanggal: '20 Jan 2024',
    status: 'Izin',
    waktu: '-',
    keterangan: 'Sakit'
  },
  {
    tanggal: '19 Jan 2024',
    status: 'Hadir',
    waktu: '06:58',
    keterangan: '-'
  },
  {
    tanggal: '18 Jan 2024',
    status: 'Hadir',
    waktu: '07:05',
    keterangan: '-'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kehadiran Siswa
        </h1>
        <p className="text-gray-600">Rekap kehadiran harian</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Hadir</p>
          <p className="text-3xl font-bold text-green-600">95%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Izin</p>
          <p className="text-3xl font-bold text-yellow-600">3 Hari</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Alpha</p>
          <p className="text-3xl font-bold text-red-600">0 Hari</p>
        </div>
      </div>

      {/* Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Riwayat Kehadiran
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>);

}