import api from '../api/axios';

// 1. Identitas
export const getIdentitas = async () => {
    const res = await api.get('/api/rencana-belajar/identitas');
    return res.data;
};

// 2. Cita-Cita (Update)
export const updateCitaCita = async (payload: any) => {
    const res = await api.post('/api/rencana-belajar/cita-cita', payload);
    return res.data;
};

// 3. Perencanaan Ringkas
export const getPerencanaan = async () => {
    const res = await api.get('/api/rencana-belajar/perencanaan');
    return res.data.perencanaan || [];
};

// 4. Target & Capaian (POST)
export const getTargetGrouped = async (payload: any) => {
    const res = await api.post('/api/rencana-belajar/target-grouped', payload);
    return res.data || {}; // Dokumentasi bilang res.data berisi dimensi
};

export const getCapaianGrouped = async (payload: any) => {
    const res = await api.post('/api/rencana-belajar/capaian-grouped', payload);
    return res.data.grouped || {};
};

// 5. Update Target Batch (Baru)
export const updateTargetBatch = async (payload: { IDKELOMPOKPERENCANAANBELAJAR: number[], TARGET: string[] }) => {
    const res = await api.post('/api/rencana-belajar/targets/batch', payload);
    return res.data;
};

// 6. Psikologi
export const getPsikologi = async () => {
    const res = await api.get('/api/rencana-belajar/psikologi');
    return res.data.psikologi || [];
};

export const getPsikologiDetail = async (id: number) => {
    const res = await api.get(`/api/rencana-belajar/psikologi/${id}`);
    return res.data;
};

export const updatePsikologi = async (id: number, payload: any) => {
    const res = await api.put(`/api/rencana-belajar/psikologi/${id}`, payload);
    return res.data;
};

// 7. Placement
export const getPlacement = async () => {
    const res = await api.get('/api/rencana-belajar/placement');
    return res.data.placement || [];
};

export const getPlacementDetail = async (payload: any) => {
    const res = await api.post('/api/rencana-belajar/placement/detail', payload);
    return res.data; // Response array
};

// 8. Studi Lanjut (Baru - Khusus IDSatuan 5)
export const getStudiLanjut = async () => {
    const res = await api.get('/api/rencana-belajar/studi');
    return res.data.studi || [];
};

export const addStudiLanjut = async (payload: { rekomendasi: string, rencana: any[] }) => {
    const res = await api.post('/api/rencana-belajar/studi', payload);
    return res.data;
};