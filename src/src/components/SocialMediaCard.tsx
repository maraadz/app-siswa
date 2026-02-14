
import { ExternalLinkIcon } from 'lucide-react';
interface SocialMediaCardProps {
  // icon: BoxIcon;
  title: string;
  color: string;
  thumbnail: string;
  url: string;
}
export default function SocialMediaCard({
  // icon: Icon,
  title,
  color,
  thumbnail,
  url
}: SocialMediaCardProps) {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all">
      <div className="relative h-32">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover" />

        <div className={`absolute inset-0 ${color} opacity-20`}></div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`${color} w-10 h-10 rounded-xl flex items-center justify-center`}>

            {/* <Icon className="w-5 h-5 text-white" /> */}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors">

          Lihat Semua
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
    </div>);

}