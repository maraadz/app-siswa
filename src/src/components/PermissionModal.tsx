import { useState, useEffect } from 'react';
import { BellRing, Volume2 } from 'lucide-react';

export default function PermissionModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Muncul jika izin belum pernah ditanyakan atau ditolak
        if ("Notification" in window && Notification.permission === "default") {
            const timer = setTimeout(() => setShow(true), 2000); // Muncul setelah 2 detik app buka
            return () => clearTimeout(timer);
        }
    }, []);

    const handleEnable = async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notifikasi aktif!');
        }
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-[#08543d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BellRing size={40} className="text-[#08543d] animate-bounce" />
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-2">Aktifkan Suara?</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        Dapatkan info nilai dan capaian terbaru secara <b>real-time</b> dengan notifikasi suara.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleEnable}
                            className="w-full py-4 bg-[#08543d] text-white rounded-2xl font-bold text-lg hover:bg-[#063d2c] transition-colors flex items-center justify-center gap-2"
                        >
                            <Volume2 size={20} />
                            Ya, Aktifkan
                        </button>

                        <button
                            onClick={() => setShow(false)}
                            className="w-full py-3 text-gray-400 font-medium text-sm"
                        >
                            Nanti Saja
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}