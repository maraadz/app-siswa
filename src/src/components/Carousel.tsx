import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface CarouselImage {
  url: string;
  caption: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoSlide?: boolean;
  interval?: number;
}

export default function Carousel({
  images,
  autoSlide = true,
  interval = 6000
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoSlide, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    /* Gunakan aspect-video (16:9) agar gambar gedung terlihat utuh.
       Overflow-visible pada container luar agar teks yang shadow-nya besar tidak terpotong.
    */
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-12 shadow-2xl bg-gray-900 
                    aspect-[16/10] md:aspect-[21/9] overflow-hidden">

      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* Zoom Out Effect: Kita mulai dari scale besar ke normal 
               agar gedung yang tadinya "dekat" jadi kelihatan "full" semua.
            */}
            <div className="w-full h-full overflow-hidden">
              <img
                src={image.url}
                alt={image.caption}
                className={`w-full h-full object-cover md:object-fill transition-transform duration-[6000ms] ease-out ${index === currentIndex ? 'scale-100' : 'scale-110'
                  }`}
              />
            </div>

            {/* Overlay Gradasi Hitam (Lampiran 3 Vibes) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {/* Caption Area: Kita pakai flex-center supaya teks benar-benar di tengah.
               Tidak ditaruh di paling bawah agar tidak terpotong pagination.
            */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-12 text-center">
              <h2
                className="text-white text-xl md:text-5xl font-black tracking-tighter uppercase leading-tight italic"
                style={{ textShadow: '0 10px 30px rgba(0,0,0,1), 0 0 50px rgba(0,0,0,0.8)' }}
              >
                {image.caption.split('-')[0]}
              </h2>

              <div className="w-16 md:w-32 h-[3px] bg-yellow-400 my-3 md:my-6 rounded-full shadow-[0_0_20px_rgba(250,204,21,1)]"></div>

              <p
                className="text-white text-[10px] md:text-lg font-bold tracking-[0.2em] uppercase max-w-[90%]"
                style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}
              >
                {image.caption.split('-')[1] || "Sekolah Pemimpin Peradaban Dunia"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi Panah */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 hidden md:flex items-center justify-center bg-black/30 hover:bg-white hover:text-black backdrop-blur-md rounded-full text-white transition-all z-20 border border-white/20"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 hidden md:flex items-center justify-center bg-black/30 hover:bg-white hover:text-black backdrop-blur-md rounded-full text-white transition-all z-20 border border-white/20"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Pagination Slim */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-700 rounded-full h-[3px] ${index === currentIndex
                ? 'bg-yellow-400 w-10 md:w-16'
                : 'bg-white/30 w-4'
              }`}
          />
        ))}
      </div>
    </div>
  );
}