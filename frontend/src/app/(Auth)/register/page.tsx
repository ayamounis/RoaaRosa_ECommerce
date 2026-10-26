'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from './RegisterForm';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className='min-h-[90vh] py-10 sm:py-16 bg-[#FBF9F3] dark:bg-[#1F1917] flex items-center justify-center'>
      <div className='container max-w-5xl'>
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className='bg-white dark:bg-[#28211E] rounded-3xl shadow-xl border border-[#EBDED6] dark:border-[#3D332E] overflow-hidden grid grid-cols-1 lg:grid-cols-12'
        >
          {/* Brand Visual Column */}
          <div className='lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-[#2B2320] text-white overflow-hidden'>
            <div className='absolute inset-0 z-0 opacity-40 mix-blend-overlay'>
              <Image
                src='/images/next/baker-by-ted-baker.jpg'
                alt='ROAROSA Girls Occasions'
                fill
                sizes='480px'
                className='object-cover object-top'
                priority
              />
            </div>
            <div className='absolute inset-0 bg-gradient-to-t from-[#2B2320] via-[#2B2320]/60 to-transparent z-0' />

            <div className='relative z-10 space-y-3'>
              <Link href='/' className='inline-block group'>
                <h2 className='font-serif text-3xl font-bold tracking-[0.22em] text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors'>
                  ROAROSA
                </h2>
                <p className='text-[10px] tracking-[0.28em] uppercase text-[#E5C2AF]'>
                  {isAr ? 'الرقة ليست ضعفاً' : 'Softness is not weakness'}
                </p>
              </Link>
            </div>

            <div className='relative z-10 space-y-4'>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#E5C2AF]'>
                <Sparkles className='w-3.5 h-3.5' />
                <span>{isAr ? 'مزايا العضوية الترحيبية' : 'Welcome Privilege'}</span>
              </div>
              <h3 className='font-serif text-2xl font-bold text-[#FAF6F0] leading-snug'>
                {isAr
                  ? 'انضمي لعائلة رواروسا واستمتعي بخصم 10% على أول طلب'
                  : 'Join the ROAROSA Family & Enjoy 10% Off Your First Order'}
              </h3>
              <p className='text-xs text-[#EBDED6]/80 leading-relaxed'>
                {isAr
                  ? 'استفيدي من الشحن السريع المجاني، الأسبقية في الإطلاقات الموسمية، وتجربة تسوق سلسة لبناتكِ.'
                  : 'Get access to priority seasonal drops, instant tracking, and bespoke styling advice.'}
              </p>
            </div>

            <div className='relative z-10 pt-4 border-t border-white/15 text-[11px] text-[#EBDED6]/60 flex justify-between items-center'>
              <span>© 2026 ROAROSA Brand</span>
              <Link href='/' className='hover:text-white flex items-center gap-1 transition-colors'>
                <span>{isAr ? 'العودة للمتجر' : 'Back to Store'}</span>
                {isRtl ? <ArrowLeft className='w-3 h-3' /> : <ArrowRight className='w-3 h-3' />}
              </Link>
            </div>
          </div>

          {/* Form Content Column */}
          <div className='lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center'>
            {/* Top Navigation Tabs */}
            <div className='flex items-center justify-between pb-6 mb-8 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              <div className='flex items-center gap-3'>
                <Link
                  href='/login'
                  className='font-serif text-lg sm:text-xl font-medium text-[#988172] hover:text-[#2B2320] dark:hover:text-[#FAF6F0] pb-1 transition-colors'
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <span className='text-[#988172]'>•</span>
                <Link
                  href='/register'
                  className='font-serif text-lg sm:text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0] border-b-2 border-[#C48D80] pb-1'
                >
                  {isAr ? 'إنشاء حساب جديد' : 'Register'}
                </Link>
              </div>

              <Link
                href='/'
                className='text-xs text-[#988172] hover:text-[#C48D80] transition-colors flex items-center gap-1'
              >
                <span>{isAr ? 'المتجر الرئيسي' : 'Storefront'}</span>
              </Link>
            </div>

            <div className='space-y-2 mb-6'>
              <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'إنشاء حسابكِ في رواروسا' : 'Create Your Account'}
              </h1>
              <p className='text-xs sm:text-sm text-[#988172]'>
                {isAr
                  ? 'أدخلي بياناتكِ للاستمتاع بتجربة تسوق راقية وشحن سريع'
                  : 'Fill in your details to start your luxury shopping journey'}
              </p>
            </div>

            {/* Enhanced Register Form */}
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
