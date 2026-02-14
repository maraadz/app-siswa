import api from '../api/axios';

/**
 * Mengambil satu data Tahun Ajaran yang sedang aktif (SEDANG_AKTIF = 1)
 */
export const getTahunAjaranAktif = async () => {
    const response = await api.get('/api/tahun-ajaran/aktif');
    return response.data;
};

/**
 * Menampilkan seluruh data Tahun Ajaran dengan pengurutan tertentu
 * @param order 'asc' (lama ke baru) atau 'desc' (baru ke lama)
 */
export const getListTahunAjaran = async (order: 'asc' | 'desc' = 'desc') => {
    const response = await api.get('/api/tahun-ajaran', {
        params: { order }
    });
    return response.data;
};

/**
 * Menampilkan data Tahun Ajaran dengan jumlah terbatas (limit)
 */
export const getTahunAjaranLimit = async (limit: number, order: 'asc' | 'desc' = 'desc') => {
    const response = await api.get(`/api/tahun-ajaran/limit/${limit}`, {
        params: { order }
    });
    return response.data;
};