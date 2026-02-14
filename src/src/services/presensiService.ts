import api from '../api/axios';

export const getPresensiLanding = async (nis: string) => {
    const res = await api.get(`/api/presensi/landing?nis=${nis}`);
    return res.data;
};

export const getPresensiBulanan = async (nis: string, bulan: string) => {
    const res = await api.post('/api/presensi/data', { nis, bulan });
    return res.data;
};

export const postTambahIzin = async (formData: FormData) => {
    const res = await api.post('/api/presensi/izin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Tambahkan ini untuk menandai sudah dibaca
export const postReadToday = async (nis: string) => {
    const res = await api.post('/api/presensi/read-today', { nis });
    return res.data;
};

export const getFileIzin = async (fileName: string) => {
  const res = await api.get('/api/presensi/file', {
    params: { path: fileName },
    responseType: 'blob'
  });

  return {
    blob: res.data,
    contentType: res.headers['content-type']
  };
};

