'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  imageid: number;
  imagepath: string;
}

interface Props {
  images: Image[];
  isLoaded: boolean;
}

export default function AutoImageSlider({ images, isLoaded }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow group">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <span className="text-gray-400">Loading image...</span>
        </div>
      )}

      {images && images.length > 0 ? (
        <>
          {/* Зургууд */}
          <div className="w-full h-full relative">
            {images.map((img, index) => (
              <img
                key={img.imageid}
                src={`https://shdmonitoring.ub.gov.mn/${img.imagepath}`}
                alt="uploaded"
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
                  index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
                }`}
              />
            ))}

            {/* Өмнөх товч */}
            <button
              onClick={goToPrev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full hidden group-hover:flex"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Дараах товч */}
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full hidden group-hover:flex"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* 👇 Indicator (dots) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center mt-4">Зураг олдсонгүй</p>
      )}
    </div>
  );
}
