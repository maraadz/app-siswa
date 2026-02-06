import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function BerprestasiPage() {
  const [activeTab, setActiveTab] = useState<'ekskul' | 'olimpiade'>('ekskul');
  const ekskulColumns = [
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

  const ekskulData = [
    {
      elemen: 'Pramuka',
      kompetensi: 'Aktif dalam kegiatan pramuka',
      nilai: 'A'
    },
    {
      elemen: 'Futsal',
      kompetensi: 'Menunjukkan kerjasama tim yang baik',
      nilai: 'A-'
    },
    {
      elemen: 'Robotika',
      kompetensi: 'Mampu membuat robot sederhana',
      nilai: 'A'
    }];

  const olimpiadeColumns = [
    {
      key: 'olimpiade',
      label: 'Olimpiade',
      width: '40%'
    },
    {
      key: 'materi',
      label: 'Materi',
      width: '40%'
    },
    {
      key: 'nilai',
      label: 'Nilai',
      width: '20%'
    }];

  const olimpiadeData = [
    {
      olimpiade: 'OSN Matematika',
      materi: 'Tingkat Kota',
      nilai: 'Juara 2'
    },
    {
      olimpiade: 'KSM',
      materi: 'Tingkat Provinsi',
      nilai: 'Juara 3'
    }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dimensi Berprestasi
        </h1>
        <p className="text-gray-600">Capaian ekstrakurikuler dan olimpiade</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('ekskul')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'ekskul' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          Ekstrakurikuler
        </button>
        <button
          onClick={() => setActiveTab('olimpiade')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'olimpiade' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          Olimpiade
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ekskul' ?
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ekstrakurikuler
          </h2>
          <DataTable columns={ekskulColumns} data={ekskulData} />
        </div> :

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Olimpiade
          </h2>
          <DataTable columns={olimpiadeColumns} data={olimpiadeData} />
        </div>
      }
    </div>);

}