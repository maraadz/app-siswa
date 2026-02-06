import React, { useState } from 'react';
import { LogInIcon, LoaderIcon } from 'lucide-react';
import api from '../api/axios';
import { Preferences } from '@capacitor/preferences'; // secure storage
import { Device } from '@capacitor/device';
import { useAuthStore } from '../store/authStore';
import type { StudentData } from '../App'; // IMPORT TYPE DENGAN BENAR
import 'animate.css';

export default function LoginPage({ onLogin }: { onLogin: (data: StudentData) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth, warnaSatuan } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isMobile = window.hasOwnProperty('Capacitor');
      const deviceIdInfo = await Device.getId();
      const infoPerangkat = await Device.getInfo();

      const realDeviceId = isMobile
        ? `android-${deviceIdInfo.identifier}`
        : `web-${navigator.platform}-${infoPerangkat.model}`;

      const response = await api.post('/api/auth/login', {
        username,
        password,
        device_id: realDeviceId,
        client: isMobile ? "mobile" : "web",
        return_refresh: true
      });

      if (response.data.status === "ok") {
        const { user, access_token, refresh_token } = response.data;
        if (isMobile && refresh_token) {
          await Preferences.set({ key: 'refresh_token', value: refresh_token }); // saat 401 mengambil kembali untuk dikirim ke body
        }

        // Simpan ke Store (Mengurus warna oren SMP dll)
        setAuth(access_token, user);

        // Callback ke App (Optional tapi biarkan tetap sinkron)
        onLogin({
          id_satuan: user.idsatuan || user.IDSATUAN,
          id: user.id || user.username,
          name: user.nama,
          nis: user.nis,
          kelas: user.kelas,
          avatar: user.foto
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.messages?.error || 'Akses ditolak. Cek kembali akun Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate__animated animate__zoomIn">

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: warnaSatuan }} />

          <div className="text-center mb-8">
            <div className="relative inline-block animate__animated animate__pulse animate__infinite">
              <img
                src="/assets/sisma.png"
                alt="Logo Sisma"
                className="w-40 h-auto mx-auto drop-shadow-xl"
                style={{ filter: 'drop-shadow(0px 10px 15px rgba(16, 92, 81, 0.2))' }}
              />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">SISMA APPS</h1>
            <p className="text-slate-400 text-sm font-medium">Sistem Informasi Siswa Sabilillah</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 rounded-2xl outline-none transition-all text-slate-800 font-semibold"
                placeholder="NIS"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 rounded-2xl outline-none transition-all text-slate-800 font-semibold"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold animate__animated animate__shakeX">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
              style={{
                backgroundColor: warnaSatuan,
                boxShadow: `0 12px 24px -10px ${warnaSatuan}88`
              }}
            >
              {isLoading ? <LoaderIcon className="w-6 h-6 animate-spin" /> : (
                <><LogInIcon className="w-5 h-5" /><span>MASUK KE SISTEM</span></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Sabilillah Islamic School Ecosystem</p>
          </div>
        </div>
      </div>
    </div>
  );
}