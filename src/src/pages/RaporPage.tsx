import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import DataTable from '../components/DataTable';
export default function RaporPage() {
  const [jenis, setJenis] = useState('Bulanan');
  const [showData, setShowData] = useState(false);
  const columns = [
  {
    key: 'pelajaran',
    label: 'Mata Pelajaran',
    width: '40%'
  },
  {
    key: 'nilai',
    label: 'Nilai',
    width: '20%'
  },
  {
    key: 'predikat',
    label: 'Predikat',
    width: '20%'
  },
  {
    key: 'keterangan',
    label: 'Keterangan',
    width: '20%'
  }];

  const data = [
  {
    pelajaran: 'Pendidikan Agama Islam',
    nilai: '90',
    predikat: 'A',
    keterangan: 'Sangat Baik'
  },
  {
    pelajaran: 'Bahasa Indonesia',
    nilai: '88',
    predikat: 'A',
    keterangan: 'Sangat Baik'
  },
  {
    pelajaran: 'Matematika',
    nilai: '85',
    predikat: 'A-',
    keterangan: 'Baik'
  },
  {
    pelajaran: 'Bahasa Inggris',
    nilai: '92',
    predikat: 'A',
    keterangan: 'Sangat Baik'
  },
  {
    pelajaran: 'IPA',
    nilai: '87',
    predikat: 'A',
    keterangan: 'Sangat Baik'
  },
  {
    pelajaran: 'IPS',
    nilai: '86',
    predikat: 'A',
    keterangan: 'Sangat Baik'
  }];

  const handleReset = () => {
    setJenis('Bulanan');
    setShowData(false);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rapor</h1>
        <p className="text-gray-600">Laporan hasil belajar siswa</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Rapor
          </label>
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none">

            <option>Bulanan</option>
            <option>Semester</option>
            <option>Cambridge</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">

            Reset
          </button>
          <button
            onClick={() => setShowData(true)}
            className="px-6 py-2 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium rounded-xl transition-colors">

            Tampilkan
          </button>
        </div>
      </div>

      {showData &&
      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Rapor {jenis}
          </h2>
          <DataTable columns={columns} data={data} />
        </div>
      }
    </div>);

}