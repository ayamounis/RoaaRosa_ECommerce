'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import SectionSlider from '../SectionSlider/SectionSlider';
import ProductCard from '@/_Components/shared/ProductCard/ProductCard';
import { IProduct } from '@/app/_interfaces/products';
import { useLanguage } from '@/context/LanguageContext';

function getCategoryFilterMatch(cat?: string): string {
  if (!cat) return 'all';
  const c = cat.toLowerCase();
  if (c === 'dresses') return 'dresses';
  if (c === 'tops') return 'tops';
  if (c === 'knitwear') return 'knitwear';
  if (c === 'sets') return 'sets';
  if (c === 'occasions') return 'occasions';
  return 'all';
}

interface GirlsTrendingClientProps {
  initialProducts: IProduct[];
  activeCategory?: string;
}

export default function GirlsTrendingClient({
  initialProducts,
  activeCategory = 'all',
}: GirlsTrendingClientProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const FILTER_PILLS = [
    { id: 'all', label: isAr ? 'كل التشكيلات' : 'All Trending' },
    { id: 'dresses', label: isAr ? 'فساتين' : 'Dresses' },
    { id: 'tops', label: isAr ? 'بلوزات وتيشيرتات' : 'Tops & Tees' },
    { id: 'knitwear', label: isAr ? 'تريكو وصوف' : 'Knits & Cardigans' },
    { id: 'sets', label: isAr ? 'أطقم وتنسيقات' : 'Sets & Outfits' },
    { id: 'occasions', label: isAr ? 'مناسبات وسهرات' : 'Occasionwear' },
  ];

  const [activeFilter, setActiveFilter] = useState(() =>
    getCategoryFilterMatch(activeCategory)
  );

  // Automatically sync active filter tab when activeCategory changes
  useEffect(() => {
    const matched = getCategoryFilterMatch(activeCategory);
    setActiveFilter(matched);
  }, [activeCategory]);

  const filteredProducts = initialProducts.filter((product) => {
    if (activeFilter === 'all') return true;
    const catSlug = (
      product.category?.slug ||
      product.category?.name ||
      ''
    ).toLowerCase();
    const title = (product.title || '').toLowerCase();

    if (activeFilter === 'dresses') {
      return (
        catSlug.includes('dress') ||
        title.includes('dress') ||
        title.includes('twirl')
      );
    }
    if (activeFilter === 'tops') {
      return (
        catSlug.includes('top') ||
        catSlug.includes('t-shirt') ||
        title.includes('top') ||
        title.includes('t-shirt') ||
        title.includes('tee')
      );
    }
    if (activeFilter === 'knitwear') {
      return (
        catSlug.includes('knit') ||
        catSlug.includes('cardigan') ||
        catSlug.includes('jumper') ||
        title.includes('knit') ||
        title.includes('cardigan') ||
        title.includes('jumper')
      );
    }
    if (activeFilter === 'sets') {
      return (
        catSlug.includes('set') ||
        catSlug.includes('suit') ||
        title.includes('set') ||
        title.includes('co-ord') ||
        title.includes('jogger')
      );
    }
    if (activeFilter === 'occasions') {
      return (
        catSlug.includes('occasion') ||
        catSlug.includes('party') ||
        title.includes('party') ||
        title.includes('occasion') ||
        title.includes('tulle') ||
        title.includes('sparkle')
      );
    }
    return true;
  });

  const displayList =
    filteredProducts.length > 0 ? filteredProducts : initialProducts;

  return (
    <div className='w-full'>
      {/* Top Header Bar with Filter Tabs and Navigation */}
      <div
        className='flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] gap-4'
        data-aos='fade-up'
      >
        <div>
          <div className='flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-[#C48D80] uppercase'>
            <Sparkles className='w-3 h-3' />
            <span>{isAr ? 'الأكثر مبيعاً' : 'Best Sellers'}</span>
          </div>
          <h2 className='font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
            {isAr ? 'الأكثر طلباً ومحبة للبنات' : 'Most Loved in Girls'}
          </h2>
        </div>

        {/* Center/Right Filter Tabs */}
        <div className='flex flex-wrap items-center gap-2'>
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-[#C48D80] text-white shadow-xs'
                  : 'bg-white dark:bg-[#28211E] text-[#988172] hover:text-[#2B2320] dark:hover:text-white border border-[#EBDED6] dark:border-[#3D332E]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Navigation Arrows & View All */}
        <div className='flex items-center gap-3'>
          <Link
            href='/products'
            className='hidden sm:inline-flex text-xs font-semibold text-[#C48D80] hover:text-[#B27B6E] underline underline-offset-4'
          >
            {isAr ? `عرض الكل (${initialProducts.length})` : `View All (${initialProducts.length})`}
          </Link>
          <div className='flex gap-2'>
            <button
              aria-label='Previous slide'
              className='review-prev-trending flex items-center justify-center size-9 rounded-full border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-white hover:bg-[#C48D80] hover:text-white hover:border-[#C48D80] transition-colors shadow-2xs cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' />
            </button>
            <button
              aria-label='Next slide'
              className='review-next-trending flex items-center justify-center size-9 rounded-full border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-white hover:bg-[#C48D80] hover:text-white hover:border-[#C48D80] transition-colors shadow-2xs cursor-pointer'
            >
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Slider with AOS */}
      <div className='mt-6' data-aos='fade-up' data-aos-delay='150'>
        <SectionSlider
          key={`slider-${activeFilter}`}
          uniqueId='trending'
          slidesPerView={4}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 1.8 },
            640: { slidesPerView: 2.3 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 },
          }}
          items={displayList.map((item, idx) => (
            <ProductCard
              key={item._id || item.id}
              product={item}
              dataAos='zoom-in'
              dataAosDelay={(idx % 4) * 80}
            />
          ))}
        />
      </div>
    </div>
  );
}
