import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import AudioPlayer from '../../components/AudioPlayer';
interface QuraniPageProps {
  studentName: string;
}
export default function QuraniPage({ studentName }: QuraniPageProps) {
  const [capaian, setCapaian] = useState('Juz 1');
  const [showProgress, setShowProgress] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [catatanOrangTua, setCatatanOrangTua] = useState('');
  const targetColumns = [
  {
    key: 'no',
    label: 'No',
    width: '10%'
  },
  {
    key: 'indikator',
    label: 'Indikator',
    width: '90%'
  }];

  const targetData = [
  {
    no: '1',
    indikator: "Membaca Al-Qur'an dengan tartil"
  },
  {
    no: '2',
    indikator: 'Memahami tajwid dasar'
  },
  {
    no: '3',
    indikator: 'Menghafal surat-surat pendek'
  },
  {
    no: '4',
    indikator: 'Memahami makna ayat'
  },
  {
    no: '5',
    indikator: "Mengamalkan nilai-nilai Al-Qur'an"
  }];

  const tercapaiColumns = [
  {
    key: 'no',
    label: 'No',
    width: '10%'
  },
  {
    key: 'tanggal',
    label: 'Tanggal',
    width: '20%'
  },
  {
    key: 'indikator',
    label: 'Indikator',
    width: '50%'
  },
  {
    key: 'catatan',
    label: 'Catatan',
    width: '20%'
  }];

  const tercapaiData = [
  {
    no: '1',
    tanggal: '15/01/2024',
    indikator: "Membaca Al-Qur'an dengan tartil",
    catatan: 'Sangat baik'
  },
  {
    no: '2',
    tanggal: '22/01/2024',
    indikator: 'Memahami tajwid dasar',
    catatan: 'Baik'
  }];

  const suratList = [
  {
    name: 'An-Nas',
    duration: '0:45'
  },
  {
    name: 'Al-Falaq',
    duration: '0:52'
  },
  {
    name: 'Al-Ikhlas',
    duration: '0:38'
  },
  {
    name: 'Al-Lahab',
    duration: '1:05'
  },
  {
    name: 'An-Nasr',
    duration: '0:48'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <BackButton to="/" />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dimensi Qurani
        </h1>
        <p className="text-gray-600">Capaian pembelajaran Al-Qur'an</p>
      </div>

      {/* Quote Islami */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <p className="text-lg font-semibold mb-2">
          "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
        </p>
        <p className="text-sm opacity-90">
          "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan
          mengajarkannya"
        </p>
        <p className="text-xs mt-2 opacity-75">— HR. Bukhari</p>
      </div>

      {/* Feature 1: Capaian Terjemah */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Capaian Terjemah</h2>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Capaian
              </label>
              <select
                value={capaian}
                onChange={(e) => setCapaian(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none">

                {Array.from(
                  {
                    length: 30
                  },
                  (_, i) =>
                  <option key={i}>Juz {i + 1}</option>

                )}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowProgress(true)}
            className="w-full sm:w-auto px-6 py-2 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium rounded-xl transition-colors">

            Tampilkan
          </button>
        </div>

        {showProgress &&
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-900 mb-4">
              Alhamdulillah ananda{' '}
              <span className="font-semibold">{studentName}</span> telah
              mencapai{' '}
              <span className="font-semibold text-emerald-600">35%</span> materi
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
              className="bg-emerald-500 h-3 rounded-full"
              style={{
                width: '35%'
              }}>
            </div>
            </div>
            <p className="text-sm text-gray-600">
              Guru Pengajar:{' '}
              <span className="font-medium">Ustadz Ahmad Fauzi, S.Pd.I</span>
            </p>
          </div>
        }

        {/* Target Keseluruhan */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Target Keseluruhan
          </h3>
          <DataTable
            columns={targetColumns}
            data={showAll ? targetData : targetData.slice(0, 5)} />

          {!showAll &&
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 w-full sm:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">

              Tampilkan Semua
            </button>
          }
        </div>

        {/* Target Tercapai */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Target Tercapai
          </h3>
          <DataTable columns={tercapaiColumns} data={tercapaiData} />
        </div>

        {/* Catatan Orang Tua */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Catatan Orang Tua
          </h3>
          <textarea
            value={catatanOrangTua}
            onChange={(e) => setCatatanOrangTua(e.target.value)}
            placeholder="Tulis catatan untuk guru..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none resize-none"
            rows={4} />

          <button className="mt-4 px-6 py-2 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium rounded-xl transition-colors">
            Simpan
          </button>
        </div>
      </section>

      {/* Feature 2: MUFI - Murottal For Kids */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          MUFI – Murottal For Kids
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Playlist surat-surat pendek
          </p>
          {suratList.map((surat, index) =>
          <div
            key={index}
            className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">

              <AudioPlayer
              title={`Surat ${surat.name}`}
              duration={surat.duration} />

            </div>
          )}
        </div>
      </section>
    </div>);

}