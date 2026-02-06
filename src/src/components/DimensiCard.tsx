import React from 'react';

interface DimensiCardProps {
  // Menggunakan React.ElementType agar bisa menerima LucideIcon maupun Ikon SVG Custom
  icon: React.ElementType;
  title: string;
  color: string;
  onClick: () => void;
}

export default function DimensiCard({
  icon: Icon,
  title,
  color,
  onClick
}: DimensiCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center group w-full transition-all outline-none"
    >
      {/* Kotak Ikon */}
      <div
        className="w-full aspect-square max-w-[80px] rounded-[24px] flex items-center justify-center mb-3 shadow-sm bg-white border border-gray-100 group-hover:shadow-md group-active:scale-90 transition-all"
      >
        {/* KIRIM color LANGSUNG SEBAGAI PROP, BUKAN LEWAT STYLE */}
        <Icon
          size={35}
          color={color}
          className="transition-transform group-hover:scale-110"
        />
      </div>

      {/* Teks Dimensi - Anti Kepotong */}
      <p className="font-bold text-gray-800 text-[11px] sm:text-xs text-center leading-tight break-words w-full px-1">
        {title}
      </p>
    </button>
  );
}