import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Banner1 from '../../../assets/picture/Foodbanner_1.png';
import Banner2 from '../../../assets/picture/Foodbanner_2.png';

type Slide = {
  id: number;
  src: string;
  alt?: string;
  title?: string;
};


// Mock slides data, fetch from API later
const slides: Slide[] = [
  { id: 1, src: Banner1, alt: 'Promo 1' },
  { id: 2, src: Banner2, alt: 'Promo 2' },
  { id: 3, src: Banner1, alt: 'Promo 3' },
];

const AUTO_PLAY_MS = 4000;

const HeroSlider: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // autoplay
    if (isPaused) return;
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_PLAY_MS);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, isPaused]);

  const prev = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % slides.length);
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-48 sm:h-56 md:h-72">
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.src}
            alt={s.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            loading="lazy"
            draggable={false}
          />
        ))}

        {/* Left / Right arrows */}
        <button
          aria-label="Previous"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md focus:outline-none z-30"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
        </button>

        <button
          aria-label="Next"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md focus:outline-none z-30"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-800" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default HeroSlider;
