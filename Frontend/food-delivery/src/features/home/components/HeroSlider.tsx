import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Banner1 from '../../../assets/picture/Foodbanner_1.png';
import Banner2 from '../../../assets/picture/PromoBanner_2.png';
import Banner3 from '../../../assets/picture/PromoBanner_3.png';
import Banner4 from '../../../assets/picture/PromoBanner_4.png';
import Banner5 from '../../../assets/picture/PromoBanner_5.png';
import Banner6 from '../../../assets/picture/PromoBanner_6.png';
// import Banner7 from '../../../assets/picture/PromoBanner_7.png';
// import Banner8 from '../../../assets/picture/PromoBanner_8.png';
// import Banner9 from '../../../assets/picture/PromoBanner_9.png';

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
  { id: 3, src: Banner3, alt: 'Promo 3' },
  { id: 4, src: Banner4, alt: 'Promo 4' },
  { id: 5, src: Banner5, alt: 'Promo 5' },
  { id: 6, src: Banner6, alt: 'Promo 6' },
  // { id: 7, src: Banner7, alt: 'Promo 7' },
  // { id: 8, src: Banner8, alt: 'Promo 8' },
  // { id: 9, src: Banner9, alt: 'Promo 9' },
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
      <div className={`w-full ${className}`}>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100"
            role="region"
            aria-roledescription="carousel"
            aria-label="Khuyến mãi nổi bật"
          >
            <div className="relative h-52 sm:h-64 md:h-80 lg:h-96">
              {slides.map((s, i) => (
                <img
                  key={s.id}
                  src={s.src}
                  alt={s.alt}
                  className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out ${
                    i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  loading="lazy"
                  draggable={false}
                />
              ))}

              {/* Subtle overlay for legibility */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Left / Right arrows */}
              <button
                aria-label="Previous"
                onClick={prev}
                className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
              </button>

              <button
                aria-label="Next"
                onClick={next}
                className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-800" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                      i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HeroSlider;
