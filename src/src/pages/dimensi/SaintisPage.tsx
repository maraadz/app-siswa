import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function SaintisPage() {
  const [activeTab, setActiveTab] = useState<'hasil' | 'project'>('hasil');
  const hasilColumns = [
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

  const hasilData = [
  {
    pelajaran: 'Matematika',
    materi: 'Aljabar',
    nilai: 'A'
  },
  {
    pelajaran: 'Fisika',
    materi: 'Gerak Lurus',
    nilai: 'A-'
  },
  {
    pelajaran: 'Kimia',
    materi: 'Struktur Atom',
    nilai: 'B+'
  },
  {
    pelajaran: 'Biologi',
    materi: 'Sel',
    nilai: 'A'
  }];

  const projectColumns = [
  {
    key: 'project',
    label: 'Nama Project',
    width: '40%'
  },
  {
    key: 'deskripsi',
    label: 'Deskripsi',
    width: '40%'
  },
  {
    key: 'nilai',
    label: 'Nilai',
    width: '20%'
  }];

  const projectData = [
  {
    project: 'Roket Air',
    deskripsi: 'Membuat roket dari botol plastik',
    nilai: 'A'
  },
  {
    project: 'Ekosistem Mini',
    deskripsi: 'Membuat terrarium ekosistem',
    nilai: 'A-'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dimensi Saintis
        </h1>
        <p className="text-gray-600">Capaian pembelajaran sains dan project</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('hasil')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'hasil' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          Capaian Hasil Belajar
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'project' ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

          My Project
        </button>
      </div>

      {/* Content */}
      {activeTab === 'hasil' ?
      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Capaian Hasil Belajar
          </h2>
          <DataTable columns={hasilColumns} data={hasilData} />
        </div> :

      <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Project
          </h2>
          <DataTable columns={projectColumns} data={projectData} />
        </div>
      }
    </div>);

}