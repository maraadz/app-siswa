import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function MultilingualPage() {
  const [activeTab, setActiveTab] = useState<'arab' | 'inggris'>('arab');
  const columns = [
  {
    key: 'pelajaran',
    label: 'Pelajaran',
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

  const arabData = [
  {
    pelajaran: 'Bahasa Arab',
    materi: "Qira'ah",
    nilai: 'A'
  },
  {
    pelajaran: 'Bahasa Arab',
    materi: 'Kitabah',
    nilai: 'A-'
  },
  {
    pelajaran: 'Bahasa Arab',
    materi: 'Muhadatsah',
    nilai: 'B+'
  },
  {
    pelajaran: 'Bahasa Arab',
    materi: "Istima'",
    nilai: 'A'
  }];

  const inggrisData = [
  {
    pelajaran: 'English',
    materi: 'Reading',
    nilai: 'A'
  },
  {
    pelajaran: 'English',
    materi: 'Writing',
    nilai: 'A'
  },
  {
    pelajaran: 'English',
    materi: 'Speaking',
    nilai: 'A-'
  },
  {
    pelajaran: 'English',
    materi: 'Listening',
    nilai: 'A'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dimensi Multilingual
        </h1>
        <p className="text-gray-600">Capaian pembelajaran bahasa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('arab')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'arab' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          Bahasa Arab
        </button>
        <button
          onClick={() => setActiveTab('inggris')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'inggris' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          Bahasa Inggris
        </button>
      </div>

      {/* Content */}
      {activeTab === 'arab' ?
      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bahasa Arab
          </h2>
          <DataTable columns={columns} data={arabData} />
        </div> :

      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bahasa Inggris
          </h2>
          <DataTable columns={columns} data={inggrisData} />
        </div>
      }
    </div>);

}