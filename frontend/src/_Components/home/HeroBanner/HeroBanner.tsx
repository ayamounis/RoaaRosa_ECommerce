'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, Film, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { getCategoryHeroConfig } from '@/data/categoryHeroConfig';

interface HeroBannerProps {
  activeCategory?: string;
}

export default function HeroBanner({ activeCategory = 'all' }: HeroBannerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMedia, setActiveMedia] = useState<'video' | 'photo'>('video');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroConfig = getCategoryHeroConfig(activeCategory);

  // Reload video whenever the category or video source changes
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying && activeMedia === 'video') {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [activeCategory, heroConfig.videoSrc, activeMedia, isPlaying]);

  // Handle play/pause toggles
  useEffect(() => {
    if (videoRef.current && activeMedia === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeMedia]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleScrollToNextSection = () => {
    const target =
      document.getElementById('shop-by-category') ||
      document.getElementById('shop-by-age') ||
      document.getElementById('trending-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className='relative w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#241E1C]'>
      <div className='relative w-full min-h-[540px] sm:min-h-[620px] lg:min-h-[700px] flex items-center'>
        {/* Background Layer: Video or Image */}
        <div className='absolute inset-0 z-0 overflow-hidden'>
          {/* Base Poster Image (Instant LCP & Fallback) */}
          <Image
            src={heroConfig.posterSrc}
            alt={heroConfig.title}
            fill
            priority
            sizes='100vw'
            className={`object-cover object-[center_35%] transition-opacity duration-700 ${
              activeMedia === 'video' && videoLoaded && !videoError
                ? 'opacity-0'
                : 'opacity-100 brightness-[0.88] dark:brightness-[0.65]'
            }`}
          />

          {/* HTML5 Fashion Campaign Video */}
          {activeMedia === 'video' && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 w-full h-full object-cover object-center brightness-[0.85] dark:brightness-[0.65] transition-opacity duration-700 ${
                videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={heroConfig.videoSrc} type='video/mp4' />
              {heroConfig.videoSrc !== '/videos/hero-campaign.mp4' && (
                <source src='/videos/hero-campaign.mp4' type='video/mp4' />
              )}
            </video>
          )}

          {/* Editorial Gradient Overlays */}
          <div className='absolute inset-0 bg-gradient-to-r from-[#2B2320]/90 via-[#2B2320]/55 to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-t from-[#2B2320]/60 via-transparent to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-t from-[#FBF9F3] via-transparent to-transparent opacity-40 dark:from-[#1F1917]' />
        </div>

        {/* Content Overlay */}
        <div className='container relative z-10 py-16 sm:py-24'>
          <div className='max-w-2xl text-white space-y-4 sm:space-y-6'>
            {/* Live Campaign Ribbon / Category Badge */}
            <div
              key={`badge-${heroConfig.id}`}
              className='inline-flex items-center gap-2 bg-[#FAF7F2]/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-widest uppercase text-[#FBF9F3] border border-white/20 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500'
            >
              <span className='w-2 h-2 rounded-full bg-[#E5C2AF] animate-pulse' />
              <span>{heroConfig.badge}</span>
            </div>

            {/* Headline */}
            <h1
              key={`title-${heroConfig.id}`}
              className='font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-white leading-tight animate-in fade-in slide-in-from-bottom-3 duration-600'
            >
              {heroConfig.headline}
            </h1>

            {/* Subheadline */}
            <p
              key={`desc-${heroConfig.id}`}
              className='text-sm sm:text-base text-[#FAF7F2]/90 max-w-lg font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700'
            >
              {heroConfig.subheadline}
            </p>

            {/* Tag Pills */}
            {heroConfig.tagPills && heroConfig.tagPills.length > 0 && (
              <div
                key={`tags-${heroConfig.id}`}
                className='flex flex-wrap items-center gap-2 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700'
              >
                {heroConfig.tagPills.map((pill, idx) => (
                  <span
                    key={idx}
                    className='px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/15 backdrop-blur-xs text-[#FAF7F2] border border-white/15'
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div
              key={`ctas-${heroConfig.id}`}
              className='pt-2 sm:pt-4 flex flex-wrap gap-2.5 sm:gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-700'
            >
              <Link
                href={heroConfig.primaryCta.href}
                className='inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-[#2B2320] text-xs sm:text-sm font-semibold hover:bg-[#E5C2AF] transition-all duration-200 shadow-md active:scale-95'
              >
                {heroConfig.primaryCta.label}
              </Link>
              <Link
                href={heroConfig.secondaryCta.href}
                className='inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#2B2320]/80 backdrop-blur-md text-white border border-white/30 text-xs sm:text-sm font-semibold hover:bg-[#2B2320] transition-all duration-200 shadow-md active:scale-95'
              >
                {heroConfig.secondaryCta.label}
              </Link>
              {heroConfig.tertiaryCta && (
                <Link
                  href={heroConfig.tertiaryCta.href}
                  className='inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#C48D80] text-white text-xs sm:text-sm font-semibold hover:bg-[#B27B6E] transition-all duration-200 shadow-md active:scale-95'
                >
                  {heroConfig.tertiaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Down Cue */}
        <button
          onClick={handleScrollToNextSection}
          aria-label='Scroll to explore collection'
          className='absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer group'
          data-aos='fade-up'
          data-aos-delay='500'
        >
          <span className='text-[10px] uppercase tracking-widest font-medium'>
            Scroll to explore
          </span>
          <ChevronDown className='w-4 h-4 animate-bounce' />
        </button>

        {/* Floating Video & Media Controller */}
        <div
          className='absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-[#2B2320]/60 backdrop-blur-md border border-white/20 p-1.5 rounded-full text-white shadow-xl'
          data-aos='fade-left'
          data-aos-delay='450'
        >
          {/* Switch Video / Photo */}
          <button
            onClick={() => {
              setActiveMedia(activeMedia === 'video' ? 'photo' : 'video');
              setIsPlaying(true);
            }}
            title={activeMedia === 'video' ? 'Switch to Lookbook Photo' : 'Switch to Campaign Film'}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide bg-white/10 hover:bg-white/20 transition-colors cursor-pointer'
          >
            {activeMedia === 'video' ? (
              <>
                <Film className='w-3.5 h-3.5 text-[#E5C2AF]' />
                <span>Film</span>
              </>
            ) : (
              <>
                <ImageIcon className='w-3.5 h-3.5 text-[#E5C2AF]' />
                <span>Still</span>
              </>
            )}
          </button>

          {/* Video Controls */}
          {activeMedia === 'video' && !videoError && (
            <>
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause Video' : 'Play Video'}
                className='p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer'
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? (
                  <Pause className='w-3.5 h-3.5' />
                ) : (
                  <Play className='w-3.5 h-3.5 fill-current' />
                )}
              </button>

              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className='p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer'
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className='w-3.5 h-3.5' />
                ) : (
                  <Volume2 className='w-3.5 h-3.5' />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
