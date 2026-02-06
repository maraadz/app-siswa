import { ChevronRightIcon, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon; // Gunakan LucideIcon, bukan BoxIcon
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  onClick
}: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group text-left border border-gray-50"
    >
      <div className="flex items-start gap-4">
        {/* GUNAKAN STYLE UNTUK WARNA DINAMIS */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );
}