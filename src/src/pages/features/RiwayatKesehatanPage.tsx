import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { Stethoscope } from 'lucide-react';

export default function RiwayatKesehatanPage() {
    const columns = [
        { key: 'tanggal', label: 'Tanggal', width: '30%' },
        { key: 'keluhan', label: 'Keluhan', width: '40%' },
        { key: 'tindakan', label: 'Tindakan', width: '30%' }
    ];

    const data = [
        { tanggal: '10 Feb 2024', keluhan: 'Demam & Pusing', tindakan: 'Istirahat & Paracetamol' },
        { tanggal: '05 Jan 2024', keluhan: 'Luka Ringan (Futsal)', tindakan: 'Pembersihan Luka' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <BackButton to="/features/kepengasuhan" />
            <div className="mb-6 mt-4">
                <h1 className="text-2xl font-black text-gray-900">Riwayat Kesehatan</h1>
                <p className="text-sm text-gray-500">Catatan kesehatan santri di Klinik Mahad</p>
            </div>

            <div className="bg-blue-600 rounded-[32px] p-8 text-white mb-8 relative overflow-hidden shadow-lg shadow-blue-100">
                <div className="relative z-10 text-center py-4">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-lg font-bold">Kesehatan Santri Baik</h2>
                    <p className="text-xs opacity-80 mt-1">Ananda dalam kondisi sehat & aktif mengikuti kegiatan.</p>
                </div>
            </div>

            <DataTable columns={columns} data={data} />
        </div>
    );
}