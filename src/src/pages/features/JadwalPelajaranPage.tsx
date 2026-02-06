import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
export default function JadwalPelajaranPage() {
  const [selectedDay, setSelectedDay] = useState('Senin');
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const columns = [
  {
    key: 'waktu',
    label: 'Waktu',
    width: '20%'
  },
  {
    key: 'pelajaran',
    label: 'Mata Pelajaran',
    width: '40%'
  },
  {
    key: 'guru',
    label: 'Guru',
    width: '30%'
  },
  {
    key: 'ruang',
    label: 'Ruang',
    width: '10%'
  }];

  const jadwalData: Record<string, any[]> = {
    Senin: [
    {
      waktu: '07:00 - 07:45',
      pelajaran: 'Pendidikan Agama Islam',
      guru: 'Ustadz Ahmad',
      ruang: 'A1'
    },
    {
      waktu: '07:45 - 08:30',
      pelajaran: 'Matematika',
      guru: 'Ibu Siti',
      ruang: 'A1'
    },
    {
      waktu: '08:30 - 09:15',
      pelajaran: 'Bahasa Indonesia',
      guru: 'Pak Budi',
      ruang: 'A1'
    },
    {
      waktu: '09:15 - 09:30',
      pelajaran: 'Istirahat',
      guru: '-',
      ruang: '-'
    },
    {
      waktu: '09:30 - 10:15',
      pelajaran: 'IPA',
      guru: 'Ibu Ani',
      ruang: 'Lab'
    },
    {
      waktu: '10:15 - 11:00',
      pelajaran: 'Bahasa Inggris',
      guru: 'Miss Sarah',
      ruang: 'A1'
    }],

    Selasa: [
    {
      waktu: '07:00 - 07:45',
      pelajaran: "Al-Qur'an Hadits",
      guru: 'Ustadz Fauzi',
      ruang: 'A1'
    },
    {
      waktu: '07:45 - 08:30',
      pelajaran: 'Matematika',
      guru: 'Ibu Siti',
      ruang: 'A1'
    },
    {
      waktu: '08:30 - 09:15',
      pelajaran: 'IPS',
      guru: 'Pak Hadi',
      ruang: 'A1'
    },
    {
      waktu: '09:15 - 09:30',
      pelajaran: 'Istirahat',
      guru: '-',
      ruang: '-'
    },
    {
      waktu: '09:30 - 10:15',
      pelajaran: 'Bahasa Arab',
      guru: 'Ustadzah Fatimah',
      ruang: 'A1'
    },
    {
      waktu: '10:15 - 11:00',
      pelajaran: 'Olahraga',
      guru: 'Pak Joko',
      ruang: 'Lapangan'
    }],

    Rabu: [
    {
      waktu: '07:00 - 07:45',
      pelajaran: 'Fiqih',
      guru: 'Ustadz Ahmad',
      ruang: 'A1'
    },
    {
      waktu: '07:45 - 08:30',
      pelajaran: 'Matematika',
      guru: 'Ibu Siti',
      ruang: 'A1'
    },
    {
      waktu: '08:30 - 09:15',
      pelajaran: 'Bahasa Indonesia',
      guru: 'Pak Budi',
      ruang: 'A1'
    },
    {
      waktu: '09:15 - 09:30',
      pelajaran: 'Istirahat',
      guru: '-',
      ruang: '-'
    },
    {
      waktu: '09:30 - 10:15',
      pelajaran: 'IPA',
      guru: 'Ibu Ani',
      ruang: 'Lab'
    },
    {
      waktu: '10:15 - 11:00',
      pelajaran: 'Seni Budaya',
      guru: 'Pak Eko',
      ruang: 'A1'
    }],

    Kamis: [
    {
      waktu: '07:00 - 07:45',
      pelajaran: 'Akidah Akhlak',
      guru: 'Ustadzah Aisyah',
      ruang: 'A1'
    },
    {
      waktu: '07:45 - 08:30',
      pelajaran: 'Matematika',
      guru: 'Ibu Siti',
      ruang: 'A1'
    },
    {
      waktu: '08:30 - 09:15',
      pelajaran: 'IPS',
      guru: 'Pak Hadi',
      ruang: 'A1'
    },
    {
      waktu: '09:15 - 09:30',
      pelajaran: 'Istirahat',
      guru: '-',
      ruang: '-'
    },
    {
      waktu: '09:30 - 10:15',
      pelajaran: 'Bahasa Inggris',
      guru: 'Miss Sarah',
      ruang: 'A1'
    },
    {
      waktu: '10:15 - 11:00',
      pelajaran: 'Prakarya',
      guru: 'Ibu Dewi',
      ruang: 'A1'
    }],

    Jumat: [
    {
      waktu: '07:00 - 07:45',
      pelajaran: 'Sejarah Kebudayaan Islam',
      guru: 'Ustadz Fauzi',
      ruang: 'A1'
    },
    {
      waktu: '07:45 - 08:30',
      pelajaran: 'Matematika',
      guru: 'Ibu Siti',
      ruang: 'A1'
    },
    {
      waktu: '08:30 - 09:15',
      pelajaran: 'Bahasa Indonesia',
      guru: 'Pak Budi',
      ruang: 'A1'
    },
    {
      waktu: '09:15 - 09:30',
      pelajaran: 'Istirahat',
      guru: '-',
      ruang: '-'
    },
    {
      waktu: '09:30 - 10:15',
      pelajaran: 'Ekstrakurikuler',
      guru: 'Pembina',
      ruang: 'Sesuai'
    }]

  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BackButton to="/" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Jadwal Pelajaran
        </h1>
        <p className="text-gray-600">Kelas X IPA 1</p>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) =>
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-[#979DA5] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>

            {day}
          </button>
        )}
      </div>

      {/* Schedule Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Jadwal {selectedDay}
        </h2>
        <DataTable columns={columns} data={jadwalData[selectedDay]} />
      </div>
    </div>);

}