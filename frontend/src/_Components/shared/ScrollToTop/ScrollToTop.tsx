'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      setIsVisible(window.scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label='Scroll to top'
        title={`Scroll to top (${Math.round(scrollProgress)}%)`}
        className='relative flex items-center justify-center size-11 sm:size-12 rounded-full bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] shadow-lg border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] hover:text-[#C48D80] transition-colors group cursor-pointer'
      >
        {/* Circular Progress Ring */}
        <svg className='absolute inset-0 size-full -rotate-90' viewBox='0 0 44 44'>
          <circle
            cx='22'
            cy='22'
            r='18'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='text-black/5 dark:text-white/10'
          />
          <circle
            cx='22'
            cy='22'
            r='18'
            fill='none'
            stroke='#C48D80'
            strokeWidth='2.5'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            className='transition-all duration-150 ease-out'
          />
        </svg>

        <ChevronUp className='w-5 h-5 relative z-10 transform group-hover:-translate-y-0.5 transition-transform' />
      </button>
    </div>
  );
}
