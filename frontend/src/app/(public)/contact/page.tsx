'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ContactSection from '@/_Components/contact/ContactSection';

export default function ContactPage() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const faqs = [
    {
      q: isAr ? 'كيف أختار المقاس المناسب لطفلتي بدقة؟' : 'How do I choose the exact right size for my daughter?',
      a: isAr
        ? 'نوفر جدول مقاسات تفصيلي بالسنتمتر مع كل فستان (محيط الصدر، الطول، والوزن الموصى به). كما يمكنكِ مراسلتنا هنا وسيقوم مستشار المقاسات بمساعدتكِ فوراً قبل إتمام الشراء.'
        : 'Every dress features a detailed centimeter size guide (chest, total length, recommended age & weight). You can also message our stylists via this form for tailored advice.',
    },
    {
      q: isAr ? 'كم تستغرق مدة شحن وتوصيل الطلبات في مصر؟' : 'What is the delivery timeframe across Egypt?',
      a: isAr
        ? 'يتم توصيل طلبات القاهرة والجيزة والإسكندرية خلال 24 إلى 48 ساعة عمل. أما باقي المحافظات فتصل خلال 2 إلى 4 أيام عمل كحد أقصى مع تتبع مباشر للطلب.'
        : 'Cairo, Giza, and Alexandria orders arrive within 24 to 48 business hours. Other governorates take 2 to 4 business days with real-time SMS tracking.',
    },
    {
      q: isAr ? 'ما هي سياسة الاستبدال والاسترجاع؟' : 'What is your exchange and return policy?',
      a: isAr
        ? 'نضمن لكِ استرجاعاً أو استبدالاً مجانياً خلال 14 يوماً من استلام الطلب، بشرط أن تكون القطعة بحالتها الأصلية غير ملبوسة ومع بطاقة العلامة التجارية.'
        : 'We offer hassle-free 14-day free returns or size exchanges on any unworn piece with original tags intact.',
    },
    {
      q: isAr ? 'هل تقدمون خدمات تفصيل خاصة لمناسبات الأفراح والخطوبة؟' : 'Do you accept bespoke occasion and party requests?',
      a: isAr
        ? 'نعم، يقدم فريق تصميم رواروسا خدمة استشارات تفصيل فساتين وصيفات العروس الصغيرات (Flower Girls) ومناسبات التخرج العائلية. تواصلي معنا عبر النموذج لتحديد موعد استشارة.'
        : 'Yes, our atelier crafts bespoke flower girl and couture family occasion sets. Message us with your event date to arrange a dedicated styling consultation.',
    },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='min-h-screen bg-[#FBF9F3] dark:bg-[#1A1513] text-[#2B2320] dark:text-[#FAF6F0]'>
      {/* Breadcrumbs */}
      <div className='border-b border-[#EBDED6] dark:border-[#3D332E] bg-white/50 dark:bg-[#28211E]/50 backdrop-blur-sm'>
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5'>
          <nav className='flex items-center gap-2 text-xs text-[#988172]'>
            <Link href='/' className='hover:text-[#C48D80] transition-colors'>
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <ChevronIcon className='w-3.5 h-3.5 text-[#988172]/60' />
            <span className='font-semibold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Contact Section Component */}
      <ContactSection />

      {/* Frequently Asked Questions Strip */}
      <section className='py-12 sm:py-16 border-t border-[#EBDED6] dark:border-[#3D332E] bg-white/40 dark:bg-[#28211E]/40'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-2 mb-10'>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-xs font-semibold text-[#988172]'>
              <HelpCircle className='w-3.5 h-3.5 text-[#C48D80]' />
              <span>{isAr ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</span>
            </div>
            <h3 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'إجابات سريعة على أهم الاستفسارات' : 'Quick Answers to Common Queries'}
            </h3>
            <p className='text-xs text-[#988172]'>
              {isAr ? 'جمعنا لكِ أبرز الأسئلة التي تسألها الأمهات حول المقاسات والشحن' : 'Commonly asked questions about sizing, materials, and delivery'}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2.5 transition-all hover:border-[#C48D80]/60'
              >
                <h4 className='text-xs sm:text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0] flex items-start gap-2'>
                  <span className='w-5 h-5 rounded-full bg-[#C48D80]/15 text-[#C48D80] flex items-center justify-center text-[10px] shrink-0 font-mono mt-0.5'>
                    {idx + 1}
                  </span>
                  <span>{faq.q}</span>
                </h4>
                <p className='text-xs text-[#988172] leading-relaxed ps-7'>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Trust Strip */}
      <section className='py-8 border-t border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E]'>
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-start'>
            <div className='flex items-center justify-center sm:justify-start gap-3.5'>
              <div className='w-11 h-11 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80] shrink-0'>
                <Sparkles className='w-5 h-5' />
              </div>
              <div>
                <h5 className='text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {isAr ? 'أقمشة فاخرة آمنة للبشرة' : 'Sensitive-Skin Certified'}
                </h5>
                <p className='text-[11px] text-[#988172]'>
                  {isAr ? 'قطن مصري 100% خالي من أي مواد قاسية' : '100% gentle Egyptian cotton fabrics'}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-center sm:justify-start gap-3.5'>
              <div className='w-11 h-11 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80] shrink-0'>
                <RotateCcw className='w-5 h-5' />
              </div>
              <div>
                <h5 className='text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {isAr ? 'استرجاع واستبدال مجاني' : '14-Day Free Returns'}
                </h5>
                <p className='text-[11px] text-[#988172]'>
                  {isAr ? 'استبدال المقاسات بسهولة تامة لباب المنزل' : 'Hassle-free doorstep exchanges'}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-center sm:justify-start gap-3.5'>
              <div className='w-11 h-11 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80] shrink-0'>
                <ShieldCheck className='w-5 h-5' />
              </div>
              <div>
                <h5 className='text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {isAr ? 'دعم مستمر وإشراف إداري' : 'Dedicated Concierge'}
                </h5>
                <p className='text-[11px] text-[#988172]'>
                  {isAr ? 'متابعة مباشرة عبر لوحة التحكم والبريد' : 'Direct management & email follow-up'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
