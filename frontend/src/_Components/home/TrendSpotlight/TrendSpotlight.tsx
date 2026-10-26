'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TrendSpotlight() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section className='py-14 sm:py-20 bg-[#FBF9F3] dark:bg-[#1F1917] transition-colors'>
      <div className='container'>
        <div
          className='flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] gap-2'
          data-aos='fade-up'
        >
          <div>
            <div className='flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-[#C48D80] uppercase'>
              <Sparkles className='w-3 h-3' />
              <span>{isAr ? 'مختارات الموسم' : 'Editorial Spotlights'}</span>
            </div>
            <h2 className='font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
              {isAr ? 'مجموعات مميزة' : 'The Edits'}
            </h2>
          </div>
          <p className='text-xs sm:text-sm text-[#988172]'>
            {isAr
              ? 'تنسيقات مصممة للدفء اليومي وذكريات طفولية ساحرة تدوم طويلاً'
              : 'Signature curations designed for everyday warmth and magical childhood memories'}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
          {/* Feature 1: The Rose Edit */}
          <div
            className='group relative overflow-hidden rounded-3xl bg-[#F5EFEB] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] min-h-[460px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300'
            data-aos='fade-right'
            data-aos-duration='800'
          >
            <div className='absolute inset-0 z-0'>
              <Image
                src='/images/next/sweat-tops-and-jogger-sets.jpg'
                alt='The Rose Edit - Cozy Fleece & Sets'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#2B2320]/90 via-[#2B2320]/35 to-transparent' />
            </div>

            <div className='relative z-10 text-white space-y-3'>
              <span className='inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-[#E5C2AF]'>
                {isAr ? 'أبرز إطلالات الموسم' : 'New Season Highlight'}
              </span>
              <h3 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                {isAr ? 'مجموعة روز الوردية' : 'The Rose Edit'}
              </h3>
              <p className='text-xs sm:text-sm text-[#FAF7F2]/90 max-w-md font-light leading-relaxed'>
                {isAr
                  ? 'أساسيات يومية ناعمة مصممة من الكتان المغسول خفيف الوزن، وتريكو مضلع ناعم، مع ألوان التيراكوتا الهادئة والدافئة.'
                  : 'Gentle everyday staples tailored in breathable washed linen, baby rib knits, and warm muted terracotta hues.'}
              </p>
              <div className='pt-2'>
                <Link
                  href='/products?color=dusty-rose'
                  className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#2B2320] text-xs font-semibold hover:bg-[#E5C2AF] transition-all shadow-md active:scale-95 group/btn'
                >
                  <span>{isAr ? 'تسوق مجموعة روز' : 'Shop The Rose Edit'}</span>
                  {isRtl ? (
                    <ArrowLeft className='w-3.5 h-3.5 transform group-hover/btn:-translate-x-1 transition-transform' />
                  ) : (
                    <ArrowRight className='w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform' />
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Occasionwear */}
          <div
            className='group relative overflow-hidden rounded-3xl bg-[#F5EFEB] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] min-h-[460px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300'
            data-aos='fade-left'
            data-aos-duration='800'
          >
            <div className='absolute inset-0 z-0'>
              <Image
                src='/images/next/dresses-shop-now.jpg'
                alt='Special Occasion & Partywear'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#2B2320]/90 via-[#2B2320]/35 to-transparent' />
            </div>

            <div className='relative z-10 text-white space-y-3'>
              <span className='inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-[#E5C2AF]'>
                {isAr ? 'حفلات واحتفالات مميزة' : 'Party & Celebrations'}
              </span>
              <h3 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                {isAr ? 'أزياء المناسبات والسهرات' : 'Special Occasionwear'}
              </h3>
              <p className='text-xs sm:text-sm text-[#FAF7F2]/90 max-w-md font-light leading-relaxed'>
                {isAr
                  ? 'فساتين وصيفات العروس، طبقات التول المنفوشة التي تدور مع الحركة، وشرائط الحرير المصممة للحظات السعيدة.'
                  : 'Flower girl designs, tiered tulle twirl dresses, and silk ribbon details made for moments worth remembering.'}
              </p>
              <div className='pt-2'>
                <Link
                  href='/products?category=occasions'
                  className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C48D80] text-white text-xs font-semibold hover:bg-[#B27B6E] transition-all shadow-md active:scale-95 group/btn'
                >
                  <span>{isAr ? 'تسوق ملابس المناسبات' : 'Shop Occasions'}</span>
                  {isRtl ? (
                    <ArrowLeft className='w-3.5 h-3.5 transform group-hover/btn:-translate-x-1 transition-transform' />
                  ) : (
                    <ArrowRight className='w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform' />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
