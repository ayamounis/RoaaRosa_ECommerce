'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Sparkles, Ruler, CheckCircle2 } from 'lucide-react';
import { GIRLS_AGE_GROUPS } from '@/data/girlsCatalog';
import { useLanguage } from '@/context/LanguageContext';

const SIZE_RECOMMENDATIONS = [
  { ageVal: 0, label: '0-6 Months', labelAr: '0 - 6 أشهر', size: '50-68 cm', sizeAr: '50 - 68 سم', group: 'baby', groupName: 'Baby Girls', groupNameAr: 'الرضع' },
  { ageVal: 1, label: '1 Year', labelAr: 'سنة واحدة', size: '74-80 cm', sizeAr: '74 - 80 سم', group: 'baby', groupName: 'Baby Girls', groupNameAr: 'الرضع' },
  { ageVal: 2, label: '2 Years', labelAr: 'سنتان', size: '86-92 cm', sizeAr: '86 - 92 سم', group: 'baby', groupName: 'Baby Girls', groupNameAr: 'الرضع' },
  { ageVal: 3, label: '3 Years', labelAr: '3 سنوات', size: '98 cm', sizeAr: '98 سم', group: 'younger', groupName: 'Younger Girls', groupNameAr: 'البنات الصغيرات' },
  { ageVal: 4, label: '4-5 Years', labelAr: '4 - 5 سنوات', size: '104-110 cm', sizeAr: '104 - 110 سم', group: 'younger', groupName: 'Younger Girls', groupNameAr: 'البنات الصغيرات' },
  { ageVal: 6, label: '6-7 Years', labelAr: '6 - 7 سنوات', size: '116-122 cm', sizeAr: '116 - 122 سم', group: 'younger', groupName: 'Younger Girls', groupNameAr: 'البنات الصغيرات' },
  { ageVal: 8, label: '8-9 Years', labelAr: '8 - 9 سنوات', size: '128-134 cm', sizeAr: '128 - 134 سم', group: 'older', groupName: 'Older Girls', groupNameAr: 'البنات الكبار' },
  { ageVal: 10, label: '10-11 Years', labelAr: '10 - 11 سنة', size: '140-146 cm', sizeAr: '140 - 146 سم', group: 'older', groupName: 'Older Girls', groupNameAr: 'البنات الكبار' },
  { ageVal: 12, label: '12 Years', labelAr: '12 سنة', size: '152 cm', sizeAr: '152 سم', group: 'older', groupName: 'Older Girls', groupNameAr: 'البنات الكبار' },
  { ageVal: 14, label: '14-16 Years (Teens)', labelAr: '14 - 16 سنة (مراهقات)', size: '158-170 cm', sizeAr: '158 - 170 سم', group: 'teen', groupName: 'Teens & Tweens', groupNameAr: 'المراهقات واليافعات' },
];

export default function ShopByAge() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'cards' | 'calculator'>('cards');
  const [selectedAgeIdx, setSelectedAgeIdx] = useState(4); // default 4-5 Years

  const rec = SIZE_RECOMMENDATIONS[selectedAgeIdx];

  return (
    <section id='shop-by-age' className='py-14 sm:py-20 bg-[#FBF9F3] dark:bg-[#1F1917] transition-colors'>
      <div className='container'>
        {/* Section Header */}
        <div
          className='flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] gap-4'
          data-aos='fade-up'
        >
          <div>
            <div className='flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-[#C48D80] uppercase'>
              <Sparkles className='w-3 h-3' />
              <span>{isAr ? 'تشكيلات حصرية حسب العمر' : 'Next Direct Signature'}</span>
            </div>
            <h2 className='font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
              {isAr ? 'تسوق حسب العمر' : 'Shop By Age'}
            </h2>
          </div>

          {/* Interactive Mode Toggle */}
          <div className='flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#28211E] p-1 rounded-full border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs'>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-white dark:bg-[#3D332E] text-[#2B2320] dark:text-white shadow-xs'
                  : 'text-[#988172] hover:text-[#2B2320] dark:hover:text-white'
              }`}
            >
              {isAr ? 'تشكيلات الأعمار' : 'Age Collections'}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#C48D80] text-white shadow-xs'
                  : 'text-[#988172] hover:text-[#C48D80]'
              }`}
            >
              <Ruler className='w-3.5 h-3.5' />
              <span>{isAr ? 'حاسبة المقاسات' : 'Size Calculator'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Visual Cards View */}
        {activeTab === 'cards' && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
            {GIRLS_AGE_GROUPS.map((group, idx) => (
              <Link
                key={group.id}
                href={group.link}
                data-aos='fade-up'
                data-aos-delay={(idx + 1) * 100}
                className='group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs hover:shadow-xl hover:border-[#C48D80] transition-all duration-300'
              >
                {/* Video or Image Frame with Aspect Ratio 3:4 */}
                <div className='relative w-full aspect-[3/4] min-h-[220px] sm:min-h-[280px] overflow-hidden bg-[#FAF7F2]'>
                  {'video' in group && group.video ? (
                    <video
                      src={group.video as string}
                      poster={group.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload='auto'
                      className='absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out'
                    />
                  ) : (
                    <Image
                      src={group.image}
                      alt={isAr ? (group as { titleAr?: string }).titleAr || group.title : group.title}
                      fill
                      sizes='(max-width: 768px) 50vw, 25vw'
                      className='object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out'
                    />
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-[#2B2320]/75 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none' />

                  {/* Size pill tag */}
                  <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-white/95 dark:bg-[#28211E]/95 backdrop-blur-xs text-[#2B2320] dark:text-[#FAF6F0] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs z-10`}>
                    {isAr ? (group as { sizesAr?: string }).sizesAr || group.sizes : group.sizes}
                  </span>

                  {/* Bottom title inside card overlay */}
                  <div className='absolute bottom-3 left-3 right-3 text-white z-10'>
                    <h3 className='font-serif text-base sm:text-lg font-semibold tracking-wide leading-tight drop-shadow-xs'>
                      {isAr ? (group as { titleAr?: string }).titleAr || group.title : group.title}
                    </h3>
                    <p className='text-xs text-[#E5C2AF] font-light mt-0.5'>
                      {isAr ? (group as { yearsAr?: string }).yearsAr || group.years : group.years}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Action Footer */}
                <div className='p-3 sm:p-3.5 flex items-center justify-between text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors'>
                  <span>{isAr ? 'استكشاف التشكيلة' : 'Explore Collection'}</span>
                  {isRtl ? (
                    <ArrowLeft className='w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform' />
                  ) : (
                    <ArrowRight className='w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform' />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 2: Interactive Size Calculator */}
        {activeTab === 'calculator' && (
          <div
            className='bg-white dark:bg-[#28211E] rounded-2xl p-6 sm:p-10 border border-[#EBDED6] dark:border-[#3D332E] shadow-sm'
            data-aos='zoom-in'
            data-aos-duration='500'
          >
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
              <div className='lg:col-span-7 space-y-6'>
                <div>
                  <span className='text-xs font-semibold tracking-widest text-[#C48D80] uppercase'>
                    {isAr ? 'محدد المقاسات والتناسب الدقيق' : 'Fit & Proportions Finder'}
                  </span>
                  <h3 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
                    {isAr ? 'اختاري المقاس المثالي لطفلتك' : 'Find Her Ideal ROAROSA Fit'}
                  </h3>
                  <p className='text-xs sm:text-sm text-[#988172] mt-1.5'>
                    {isAr
                      ? 'حددي عمر ابنتك الحالي لعرض المقاسات المناسبة، مجال الطول، والتشكيلات المخصصة لها.'
                      : 'Select your daughter’s current age to reveal tailor-made body measurements, height range, and suitable collections.'}
                  </p>
                </div>

                {/* Age selector pills */}
                <div>
                  <label className='block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] uppercase tracking-wider mb-2.5'>
                    {isAr ? 'عمر الطفلة:' : "Child's Age:"}
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {SIZE_RECOMMENDATIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type='button'
                        onClick={() => setSelectedAgeIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selectedAgeIdx === idx
                            ? 'bg-[#C48D80] text-white border-[#C48D80] shadow-2xs font-semibold'
                            : 'border-[#EBDED6] dark:border-[#3D332E] text-[#2B2320] dark:text-[#FAF6F0] hover:border-[#C48D80]'
                        }`}
                      >
                        {isAr ? item.labelAr || item.label : item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features Checklist */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#5A4F4A] dark:text-[#D1C5BD]'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 text-[#C48D80]' />
                    <span>{isAr ? 'قصات مريحة وتوسعات محسوبة لحرية الحركة' : 'Relaxed comfort drape with seam allowances'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 text-[#C48D80]' />
                    <span>{isAr ? 'استبدال مجاني للمقاس خلال 14 يوماً من باب البيت' : 'Free size exchanges within 14 days in Egypt'}</span>
                  </div>
                </div>
              </div>

              {/* Right Output Box */}
              <div className='lg:col-span-5 bg-[#FAF7F2] dark:bg-[#1F1917] p-6 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] text-center space-y-4'>
                <span className='text-[10px] font-semibold tracking-widest uppercase text-[#C48D80]'>
                  {isAr ? 'المقاس المقترح' : 'Recommended Fit'}
                </span>
                <div className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-white'>
                  {isAr ? rec.labelAr || rec.label : rec.label}
                </div>
                <div className='inline-block px-4 py-1.5 rounded-full bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs font-semibold text-[#2B2320] dark:text-[#E5C2AF]'>
                  {isAr ? `الطول: ${rec.sizeAr || rec.size}` : `Height: ${rec.size}`}
                </div>
                <p className='text-xs text-[#988172] leading-relaxed max-w-xs mx-auto'>
                  {isAr ? (
                    <>
                      يناسب تماماً قسم <strong>{rec.groupNameAr || rec.groupName}</strong> مع نهايات وخياطة فائقة النعومة.
                    </>
                  ) : (
                    <>
                      Fits naturally into the <strong>{rec.groupName}</strong> category, tailored with soft waistbands and gentle hems.
                    </>
                  )}
                </p>
                <div className='pt-2'>
                  <Link
                    href={`/products?age=${rec.group}`}
                    className='inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wide uppercase transition-all shadow-md active:scale-98'
                  >
                    <span>{isAr ? `تسوق تشكيلة ${rec.groupNameAr || rec.groupName}` : `Shop ${rec.groupName} Collection`}</span>
                    {isRtl ? <ArrowLeft className='w-4 h-4' /> : <ArrowRight className='w-4 h-4' />}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
