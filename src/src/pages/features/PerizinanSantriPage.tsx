import BackButton from '../../components/BackButton';
import DataTable from '../../components/DataTable';
import { ClipboardCheck } from 'lucide-react';

export default function PerizinanSantriPage() {
    const columns = [
        { key: 'jenis', label: 'Jenis Izin', width: '30%' },
        { key: 'tgl_kembali', label: 'Tgl Kembali', width: '40%' },
        { key: 'status', label: 'Status', width: '30%' }
    ];

    const data = [
        { jenis: 'Izin Pulang', tgl_kembali: '15 Feb 2024', status: 'Disetujui' },
        { jenis: 'Izin Keluar', tgl_kembali: '11 Feb 2024', status: 'Selesai' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <BackButton to="/features/kepengasuhan" />
            <div className="mb-8 mt-4 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Perizinan Santri</h1>
                <p className="text-sm text-gray-500 font-medium px-10">Monitoring izin keluar dan kepulangan santri secara real-time</p>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-2">
                <DataTable columns={columns} data={data} />
            </div>

            <p className="mt-6 text-[10px] text-center text-gray-400 font-medium px-10">
                *Pengajuan izin hanya dapat dilakukan melalui aplikasi wali santri atau sistem resmi Mahad.
            </p>
        </div>
    );
}