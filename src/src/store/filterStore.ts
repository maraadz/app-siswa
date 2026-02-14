import { create } from 'zustand';
import { getDaftarTahunAjaran } from '../services/dimensiService';

interface FilterState {
    activeThn: string;
    activeSmt: string;
    listTahun: any[]; // Simpan daftar tahun dari API di sini
    setFilter: (thn: string | number, smt: string | number) => void;
    initializeFilter: (userData: any) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set) => ({
    activeThn: '',
    activeSmt: '',
    listTahun: [],

    setFilter: (thn, smt) => set({
        activeThn: String(thn),
        activeSmt: String(smt)
    }),

    initializeFilter: async (userData) => {
        const now = new Date();
        const month = now.getMonth();
        // Semester 2: Jan (0) - Juli (6). Sabilillah biasanya Juli/Agustus ganti TA.
        let autoSmt = (month >= 0 && month <= 6) ? "2" : "1";

        let daftarTahun = [];
        let thnAktifId = '';

        try {
            // Tambahkan sedikit delay atau check token jika perlu
            const resTahun = await getDaftarTahunAjaran();

            if (resTahun && resTahun.status === 'ok') {
                daftarTahun = resTahun.data;
                const aktif = daftarTahun.find((t: any) => t.SEDANG_AKTIF === 1);
                if (aktif) thnAktifId = String(aktif.IDTAHUNAJARAN);
            }
        } catch (err: any) {
            console.warn("[Filter] Gagal ambil TA dari API, menggunakan fallback.", err.message);
            // Jika 401, biarkan interceptor yang menangani logout, 
            // di sini kita cukup pastikan app tidak crash.
        }

        // Fallback jika API gagal
        if (!thnAktifId) {
            thnAktifId = userData?.kelas?.idtahunajaran || userData?.IDTAHUNAJARAN || "9";
        }

        set({
            listTahun: daftarTahun,
            activeThn: thnAktifId,
            activeSmt: autoSmt
        });

        console.log(`[Filter] Sinkron API Berhasil. Thn: ${thnAktifId}, Smt: ${autoSmt}`);
    }
}));