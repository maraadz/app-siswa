import React from 'react';
import BackButton from '../../components/BackButton';
import { CalendarIcon, UserIcon } from 'lucide-react';
export default function InformasiSekolahPage() {
  const berita = [
  {
    title: 'Penerimaan Siswa Baru Tahun Ajaran 2024/2025',
    date: '20 Jan 2024',
    author: 'Admin Sekolah',
    excerpt:
    'Pendaftaran siswa baru telah dibuka untuk tahun ajaran 2024/2025. Informasi lengkap dapat dilihat di website resmi sekolah.',
    image:
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800'
  },
  {
    title: 'Kegiatan Pesantren Ramadhan 2024',
    date: '18 Jan 2024',
    author: 'Bagian Kesiswaan',
    excerpt:
    'Sekolah akan mengadakan kegiatan pesantren Ramadhan selama bulan suci Ramadhan. Pendaftaran dibuka mulai hari ini.',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800'
  },
  {
    title: 'Prestasi Siswa di Olimpiade Sains Nasional',
    date: '15 Jan 2024',
    author: 'Bagian Akademik',
    excerpt:
    'Siswa-siswi Sabilillah berhasil meraih medali emas dan perak di Olimpiade Sains Nasional tingkat provinsi.',
    image:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Informasi Sekolah
        </h1>
        <p className="text-gray-600">Berita dan pengumuman terbaru</p>
      </div>

      <div className="space-y-6">
        {berita.map((item, index) =>
        <article
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">

            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 md:h-full object-cover" />

              </div>
              <div className="p-6 md:w-2/3">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {item.author}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{item.excerpt}</p>
                <button className="text-[#979DA5] hover:text-[#858b93] font-medium transition-colors">
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>);

}