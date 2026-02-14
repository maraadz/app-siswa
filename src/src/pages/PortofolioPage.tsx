import { PlusIcon, FileIcon, ImageIcon, VideoIcon } from 'lucide-react';
interface PortofolioPageProps {
  studentName: string;
}
export default function PortofolioPage({ studentName }: PortofolioPageProps) {
  const portfolioItems = [
  {
    type: 'image',
    title: 'Karya Seni - Kaligrafi',
    date: '15 Jan 2024',
    thumbnail:
    'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400'
  },
  {
    type: 'document',
    title: 'Esai - Pentingnya Pendidikan',
    date: '10 Jan 2024',
    thumbnail: null
  },
  {
    type: 'video',
    title: 'Presentasi Project Sains',
    date: '5 Jan 2024',
    thumbnail:
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'
  },
  {
    type: 'image',
    title: 'Lukisan - Pemandangan Alam',
    date: '28 Des 2023',
    thumbnail:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  }];

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return VideoIcon;
      default:
        return FileIcon;
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Portofolio</h1>
        <p className="text-gray-600">{studentName}</p>
      </div>

      {/* Upload Button */}
      <button className="w-full mb-6 bg-[#979DA5] hover:bg-[#858b93] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        <PlusIcon className="w-5 h-5" />
        Upload Karya Baru
      </button>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioItems.map((item, index) => {
          const Icon = getIcon(item.type);
          return (
            <button
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left group">

              <div className="relative h-48 bg-gray-200">
                {item.thumbnail ?
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> :


                <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-16 h-16 text-gray-400" />
                  </div>
                }
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
            </button>);

        })}
      </div>
    </div>);

}