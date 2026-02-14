import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { Users } from 'lucide-react';

export default function RiwayatKonselingPage() {
    const columns = [
        { key: 'tanggal', label: 'Tanggal', width: '30%' },
        { key: 'perihal', label: 'Perihal', width: '40%' },
        { key: 'status', label: 'Status', width: '30%' }
    ];

    const data = [
        { tanggal: '12 Feb 2024', perihal: 'Bimbingan Karir', status: 'Selesai' },
        { tanggal: '01 Feb 2024', perihal: 'Motivasi Belajar', status: 'Selesai' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <BackButton to="/features/kepengasuhan" />
            <div className="mb-8 mt-4">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Riwayat Konseling</h1>
                <p className="text-sm text-gray-500 font-medium">Layanan bimbingan dan motivasi santri</p>
            </div>

            <div className="bg-purple-600 rounded-[32px] p-8 text-white mb-8 shadow-lg shadow-purple-100">
                <Users className="w-12 h-12 mb-4 opacity-80" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Bimbingan Aktif</h2>
                <p className="text-xs opacity-80 leading-relaxed">Ananda rutin mengikuti sesi motivasi untuk pengembangan diri di Mahad.</p>
            </div>

            <DataTable columns={columns} data={data} />
        </div>
    );
}