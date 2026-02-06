import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { StudentData } from '../../App';
import { UploadIcon } from 'lucide-react';
interface KehadiranPageProps {
  studentData: StudentData;
}
export default function KehadiranPage({ studentData }: KehadiranPageProps) {
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const columns = [
  {
    key: 'tanggal',
    label: 'Tanggal',
    width: '25%'
  },
  {
    key: 'keterangan',
    label: 'Keterangan',
    width: '50%'
  },
  {
    key: 'status',
    label: 'Status',
    width: '25%'
  }];

  const data = [
  {
    tanggal: '15 Jan 2024',
    keterangan: 'Sakit demam',
    status: 'Selesai'
  },
  {
    tanggal: '10 Jan 2024',
    keterangan: 'Keperluan keluarga',
    status: 'Proses'
  }];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Permohonan izin berhasil diajukan');
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kehadiran Siswa
        </h1>
        <p className="text-gray-600">Permohonan izin tidak hadir</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Siswa
            </label>
            <input
              type="text"
              value={studentData.name}
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-500" />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kelas
            </label>
            <input
              type="text"
              value={studentData.kelas}
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-500" />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none"
              required />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none"
              required />

          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan
          </label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Jelaskan alasan tidak hadir..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none resize-none"
            rows={4}
            required />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File (PDF/JPG, max 3MB)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#979DA5] transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload" />

            <label htmlFor="file-upload" className="cursor-pointer">
              <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Klik untuk upload file'}
              </p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium rounded-xl transition-colors">

          Simpan
        </button>
      </form>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Riwayat Permohonan
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>);

}