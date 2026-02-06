import React from 'react';

const GlobalLoading: React.FC<{ message?: string }> = ({ message }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
        }}>
            <div className="flex flex-col items-center">
                {/* Path '/assets/...' dengan garis miring di depan adalah KUNCI agar tidak 404 */}
                <img
                    src="/assets/sisma.png"
                    className="w-20 h-20 animate-bounce"
                    alt="Loading..."
                    onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=S&background=08543d&color=fff" }}
                />
                <p className="mt-4 text-[10px] font-black text-emerald-800 tracking-[0.3em] uppercase">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default GlobalLoading;