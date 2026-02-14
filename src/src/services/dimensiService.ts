import api from '../api/axios';

export const getDaftarTahunAjaran = async () => {
    try {
        const res = await api.get('/api/tahun-ajaran?order=desc');
        return res.data; // Mengembalikan { status: 'ok', data: [...] }
    } catch (error) {
        console.error("Gagal ambil tahun ajaran:", error);
        return null;
    }
};

export const getRekapDimensi = async (thn: string | number, smt: string | number, idDimensi: number) => {
    // Kita kirim id dan sub sekaligus agar sinkron dengan kebutuhan API 
    // yang terlihat di Postman dan pesan error log.
    const response = await api.get('/api/dimensi/search', {
        params: {
            thn: thn,
            smt: smt,
            id: idDimensi
        }
    });
    return response.data;
};

export const getDetailNilaiSKL = async (payload: { id_kelompok_siswa: number; id_skl: number; thn: number | string }) => {
    const response = await api.post('/api/dimensi/nilai/detail', payload);
    return response.data;
};

export const getQuraniCapaian = async (kategori: string, thn: string | number) => {
    const response = await api.get(`/api/dimensi/qurani/${kategori}`, {
        params: { thn }
    });
    return response.data;
};