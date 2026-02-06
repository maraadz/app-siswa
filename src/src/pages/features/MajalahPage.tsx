import React from 'react';
import BackButton from '../../components/BackButton';
import { BookOpenIcon, DownloadIcon } from 'lucide-react';
export default function MajalahPage() {
  const majalah = [
  {
    title: 'Majalah Pendidikan Edisi Januari 2024',
    cover:
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
    description: 'Tema: Teknologi dalam Pendidikan Islam',
    date: 'Januari 2024'
  },
  {
    title: 'Majalah Pendidikan Edisi Desember 2023',
    cover:
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    description: 'Tema: Membangun Karakter Siswa',
    date: 'Desember 2023'
  },
  {
    title: 'Majalah Pendidikan Edisi November 2023',
    cover:
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    description: 'Tema: Prestasi Siswa Sabilillah',
    date: 'November 2023'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Majalah Pendidikan
        </h1>
        <p className="text-gray-600">Bacaan dan artikel edukatif</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {majalah.map((item, index) =>
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all group">

            <div className="relative h-64">
              <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <BookOpenIcon className="w-8 h-8 text-white mb-2" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <p className="text-xs text-gray-500 mb-4">{item.date}</p>
              <button className="w-full flex items-center justify-center gap-2 bg-[#979DA5] hover:bg-[#858b93] text-white py-2 rounded-xl transition-colors">
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

}