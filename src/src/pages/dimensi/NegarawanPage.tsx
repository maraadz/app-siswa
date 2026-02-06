import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function NegarawanPage() {
  const [semester, setSemester] = useState('Ganjil');
  const [showData, setShowData] = useState(false);
  const columns = [
  {
    key: 'elemen',
    label: 'Elemen',
    width: '40%'
  },
  {
    key: 'kompetensi',
    label: 'Kompetensi',
    width: '40%'
  },
  {
    key: 'nilai',
    label: 'Nilai',
    width: '20%'
  }];

  const data = [
  {
    elemen: 'Karakter Unggul',
    kompetensi: 'Menunjukkan sikap jujur, disiplin, dan bertanggung jawab',
    nilai: 'A'
  },
  {
    elemen: 'Nasionalisme',
    kompetensi: 'Memahami dan mengamalkan nilai-nilai Pancasila',
    nilai: 'A'
  },
  {
    elemen: 'Kepemimpinan',
    kompetensi: 'Mampu memimpin dan bekerja sama dalam kelompok',
    nilai: 'A-'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dimensi Negarawan
        </h1>
        <p className="text-gray-600">
          Capaian karakter kepemimpinan dan nasionalisme
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none">

              <option>Ganjil</option>
              <option>Genap</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowData(true)}
          className="w-full sm:w-auto px-6 py-2 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium rounded-xl transition-colors">

          Tampilkan
        </button>
      </div>

      {showData &&
      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Capaian Negarawan
          </h2>
          <DataTable columns={columns} data={data} />
        </div>
      }
    </div>);

}