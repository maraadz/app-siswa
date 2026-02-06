import api from '../api/axios';

export const getRekapDimensi = async (thn: string | number, smt: string | number, idDimensi: number) => {
    const response = await api.get('/api/dimensi/search', {
        params: { thn, smt, id: idDimensi }
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