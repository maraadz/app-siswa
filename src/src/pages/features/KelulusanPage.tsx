import React from 'react';
import BackButton from '../../components/BackButton';
import {
  GraduationCapIcon,
  CheckCircleIcon,
  AlertCircleIcon } from
'lucide-react';
export default function KelulusanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kelulusan</h1>
        <p className="text-gray-600">Informasi kelulusan siswa</p>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-6 text-center">
        <GraduationCapIcon className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Status Kelulusan</h2>
        <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-xl">
          <CheckCircleIcon className="w-6 h-6" />
          <span className="text-xl font-semibold">Lulus</span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detail Kelulusan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Nilai Rata-rata</p>
            <p className="text-2xl font-bold text-gray-900">88.5</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Predikat</p>
            <p className="text-2xl font-bold text-gray-900">Sangat Baik</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Ranking Kelas</p>
            <p className="text-2xl font-bold text-gray-900">3 dari 30</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Tahun Lulus</p>
            <p className="text-2xl font-bold text-gray-900">2024</p>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Persyaratan Kelulusan
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">Nilai rata-rata minimal 75</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">Kehadiran minimal 90%</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">
              Hafalan Al-Qur'an minimal 2 Juz
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">
              Tidak ada tunggakan administrasi
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
        <div className="flex gap-3">
          <AlertCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Informasi Penting
            </h4>
            <p className="text-sm text-blue-700">
              Pengambilan ijazah dapat dilakukan mulai tanggal 1 Juni 2024 di
              kantor tata usaha sekolah dengan membawa kartu pelajar dan surat
              keterangan bebas administrasi.
            </p>
          </div>
        </div>
      </div>
    </div>);

}