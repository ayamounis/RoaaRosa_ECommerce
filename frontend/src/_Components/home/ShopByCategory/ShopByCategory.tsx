'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GIRLS_CATEGORIES } from '@/data/girlsCatalog';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ShopByCategory() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const FILTER_TAGS = [
    { id: 'all', label: isAr ? 'كل التشكيلات' : 'All Collections' },
    { id: 'dresses', label: isAr ? 'فساتين وأطقم خفيفة' : 'Dresses & Playsuits' },
    { id: 'knitwear', label: isAr ? 'صوف وتريكو وبلوزات' : 'Knitwear & Tops' },
    { id: 'occasions', label: isAr ? 'مناسبات وأطقم' : 'Occasions & Sets' },
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const allCategories = GIRLS_CATEGORIES.filter((c) => c.id !== 'all');

  const filteredCategories = allCategories.filter((cat) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dresses') return cat.slug === 'dresses';
    if (activeFilter === 'knitwear') return ['knitwear', 'tops', 'coats'].includes(cat.slug);
    if (activeFilter === 'occasions') return ['occasions', 'sets', 'nightwear'].includes(cat.slug);
    return true;
  });

  return (
    <section id='shop-by-category' className='py-14 sm:py-20 bg-[#F5EFEB]/60 dark:bg-[#241E1C]/60 border-y border-[#EBDED6] dark:border-[#3D332E] transition-colors'>
      <div className='container'>
        <div className='text-center max-w-xl mx-auto mb-8' data-aos='fade-up'>
          <span className='inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-[#C48D80] uppercase'>
            <Sparkles className='w-3 h-3' />
            <span>{isAr ? 'مختارات بعناية' : 'Carefully Curated'}</span>
          </span>
          <h2 className='font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
            {isAr ? 'تسوق حسب الفئة' : 'Shop By Category'}
          </h2>
          <p className='text-xs sm:text-sm text-[#988172] mt-2'>
            {isAr
              ? 'استكشفي أروع التنسيقات المصممة للبشرة الرقيقة بلمسات من النعومة والأناقة الدائمة'
              : 'Explore foundational pieces crafted for delicate skin, tender touch, and effortless elegance'}
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div
          className='flex flex-wrap items-center justify-center gap-2 mb-10'
          data-aos='fade-up'
          data-aos-delay='100'
        >
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveFilter(tag.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeFilter === tag.id
                  ? 'bg-[#2B2320] dark:bg-[#FAF6F0] text-white dark:text-[#2B2320] shadow-sm scale-105'
                  : 'bg-white dark:bg-[#28211E] text-[#988172] hover:text-[#2B2320] dark:hover:text-white border border-[#EBDED6] dark:border-[#3D332E]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Circular Categories Grid with Hover Cards & AOS */}
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6'>
          {filteredCategories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              data-aos='zoom-in'
              data-aos-delay={(idx % 8) * 60 + 100}
              className='group flex flex-col items-center text-center transition-transform hover:-translate-y-1.5 duration-300'
            >
              <div className='relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden p-1.5 border-2 border-[#EBDED6] dark:border-[#3D332E] group-hover:border-[#C48D80] transition-all duration-300 shadow-2xs group-hover:shadow-md bg-white dark:bg-[#28211E]'>
                <div className='relative w-full h-full rounded-full overflow-hidden'>
                  <Image
                    src={cat.image}
                    alt={isAr ? (cat as { nameAr?: string }).nameAr || cat.name : cat.name}
                    fill
                    sizes='96px'
                    className='object-cover group-hover:scale-115 transition-transform duration-500'
                  />
                </div>

                {/* Subtitle count pill on hover */}
                <div className='absolute inset-0 bg-[#2B2320]/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity duration-300'>
                  <span className='text-[10px] text-white font-semibold tracking-wide'>
                    {isAr ? 'عرض الكل' : 'View All'}
                  </span>
                </div>
              </div>

              <span className='mt-3 text-xs font-medium text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors leading-snug line-clamp-1'>
                {isAr ? (cat as { nameAr?: string }).nameAr || cat.name : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
