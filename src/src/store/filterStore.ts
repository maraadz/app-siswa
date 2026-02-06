import { create } from 'zustand';

interface FilterState {
    activeThn: string | number;
    activeSmt: string | number;
    setFilter: (thn: string | number, smt: string | number) => void;
    initializeFilter: (userData: any) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    activeThn: '',
    activeSmt: '',
    setFilter: (thn, smt) => set({ activeThn: thn, activeSmt: smt }),
    initializeFilter: (userData) => {
        if (userData) {
            // Menangkap ID dari login (Bisa besar/kecil sesuai DB)
            const idThn = userData.IDTAHUNAJARAN || userData.idtahunajaran || userData.id_tahun_ajaran;
            const smt = userData.SEMESTER || userData.semester || userData.id_semester;

            set({
                activeThn: idThn !== undefined ? String(idThn) : '',
                activeSmt: smt !== undefined ? String(smt) : ''
            });
        }
    }
}));