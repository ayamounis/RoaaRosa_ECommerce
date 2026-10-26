'use client';

import { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShieldCheck, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success(isAr ? 'أهلاً بكِ في نادي رواروسا! تم تفعيل كود الخصم 10% بنجاح.' : 'Welcome to the ROAROSA Club! Your 10% code has been unlocked.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ROAROSA10');
    setCopied(true);
    toast.success(isAr ? 'تم نسخ كود الخصم ROAROSA10 بنجاح!' : 'Coupon code ROAROSA10 copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <footer className='bg-[#2B2320] text-[#FBF9F3] border-t border-[#3D332E] pt-14 pb-8 transition-colors'>
      <div className='container'>
        {/* Top Newsletter Strip with AOS */}
        <div
          className='pb-12 mb-12 border-b border-[#3D332E] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'
          data-aos='fade-up'
        >
          <div className='lg:col-span-6 space-y-2'>
            <span className='inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#E5C2AF]'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>{isAr ? 'نادي رواروسا' : 'ROAROSA Club'}</span>
            </span>
            <h3 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
              {isAr ? 'استمتعي بخصم 10% على أول طلب لبنوتك' : 'Enjoy 10% off your first girls’ order'}
            </h3>
            <p className='text-xs text-[#EBDED6]/80'>
              {isAr
                ? 'كوني أول من يتعرف على أحدث التشكيلات الموسمية، أزياء المناسبات الحصرية، وعروض العائلة المميزة.'
                : 'Be the first to hear about new seasonal drops, delicate occasion edits, and exclusive family offers.'}
            </p>
          </div>

          <div className='lg:col-span-6'>
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className='flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto'>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? 'أدخلي بريدك الإلكتروني' : 'Enter your email address'}
                  className='flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80]'
                />
                <button
                  type='submit'
                  className='px-6 py-3 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer'
                >
                  {isAr ? 'تفعيل خصم 10%' : 'Unlock 10% Off'}
                </button>
              </form>
            ) : (
              <div className='flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white/10 border border-[#E5C2AF]/40 max-w-md lg:ml-auto animate-in fade-in duration-300'>
                <div className='flex-1 text-center sm:text-left'>
                  <span className='text-[10px] uppercase tracking-wider text-[#E5C2AF] block'>
                    {isAr ? 'كوبون الترحيب الخاص بكِ' : 'Your Welcome Voucher'}
                  </span>
                  <span className='font-mono font-bold text-sm text-white tracking-widest'>
                    ROAROSA10
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer'
                >
                  {copied ? <Check className='w-3.5 h-3.5' /> : <Copy className='w-3.5 h-3.5' />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Main Columns with AOS */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-12'>
          {/* Column 1: Brand & Philosophy */}
          <div className='col-span-2 md:col-span-1 space-y-4' data-aos='fade-up' data-aos-delay='100'>
            <Link href='/' className='inline-block'>
              <h2 className='font-serif text-2xl font-bold tracking-[0.22em] text-white'>
                ROAROSA
              </h2>
              <p className='text-[9px] uppercase tracking-[0.25em] text-[#E5C2AF] mt-0.5'>
                {isAr ? 'الرقة ليست ضعفاً' : 'Softness is not weakness'}
              </p>
            </Link>
            <p className='text-xs text-[#EBDED6]/70 leading-relaxed'>
              {isAr
                ? 'أزياء راقية للبنات مصممة بعناية فائقة للأيام الطفولية الهادئة والبشرة الحساسة بأناقة تدوم طويلاً.'
                : 'Premium girls’ clothing thoughtfully designed for gentle childhood days, sensitive skin, and timeless elegance.'}
            </p>
            <div className='flex items-center gap-3 pt-2 text-[#E5C2AF]'>
              <Link href='#' className='p-2 rounded-full bg-white/5 hover:bg-[#C48D80] hover:text-white transition-colors' aria-label='Instagram'>
                <Instagram className='w-4 h-4' />
              </Link>
              <Link href='#' className='p-2 rounded-full bg-white/5 hover:bg-[#C48D80] hover:text-white transition-colors' aria-label='Facebook'>
                <Facebook className='w-4 h-4' />
              </Link>
              <Link href='#' className='p-2 rounded-full bg-white/5 hover:bg-[#C48D80] hover:text-white transition-colors' aria-label='Twitter'>
                <Twitter className='w-4 h-4' />
              </Link>
            </div>
          </div>

          {/* Column 2: Girls Departments */}
          <div className='space-y-3' data-aos='fade-up' data-aos-delay='200'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-[#E5C2AF]'>
              {isAr ? 'أقسام وتشكيلات البنات' : 'Girls Departments'}
            </h4>
            <ul className='space-y-2 text-xs text-[#EBDED6]/80'>
              <li>
                <Link href='/products?age=baby' className='hover:text-white transition-colors'>
                  {isAr ? 'الرضع (0-2 سنة)' : 'Baby Girls (0-2 Yrs)'}
                </Link>
              </li>
              <li>
                <Link href='/products?age=younger' className='hover:text-white transition-colors'>
                  {isAr ? 'البنات الصغيرات (3-7 سنوات)' : 'Younger Girls (3-7 Yrs)'}
                </Link>
              </li>
              <li>
                <Link href='/products?age=older' className='hover:text-white transition-colors'>
                  {isAr ? 'البنات الكبار (8-16 سنة)' : 'Older Girls (8-16 Yrs)'}
                </Link>
              </li>
              <li>
                <Link href='/products?category=dresses' className='hover:text-white transition-colors'>
                  {isAr ? 'فساتين وأطقم خفيفة' : 'Dresses & Playsuits'}
                </Link>
              </li>
              <li>
                <Link href='/products?category=occasions' className='hover:text-white transition-colors'>
                  {isAr ? 'ملابس مناسبات وحفلات' : 'Occasionwear & Party'}
                </Link>
              </li>
              <li>
                <Link href='/products?category=knitwear' className='hover:text-white transition-colors'>
                  {isAr ? 'تريكو وسويترات صوف' : 'Knitwear & Cardigans'}
                </Link>
              </li>
              <li>
                <Link href='/products?category=sale' className='text-[#E5C2AF] font-medium hover:underline'>
                  {isAr ? 'تخفيضات وعروض خاصة' : 'Sale & Offers'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className='space-y-3' data-aos='fade-up' data-aos-delay='300'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-[#E5C2AF]'>
              {isAr ? 'خدمة ومساعدة العملاء' : 'Customer Help'}
            </h4>
            <ul className='space-y-2 text-xs text-[#EBDED6]/80'>
              <li>
                <Link href='/allorders' className='hover:text-white transition-colors'>
                  {isAr ? 'تتبع ومتابعة الطلب' : 'Track My Order'}
                </Link>
              </li>
              <li>
                <Link href='/products' className='hover:text-white transition-colors'>
                  {isAr ? 'معلومات الشحن والتوصيل' : 'Delivery & Shipping Info'}
                </Link>
              </li>
              <li>
                <Link href='/products' className='hover:text-white transition-colors'>
                  {isAr ? 'إرجاع واستبدال مجاني خلال 14 يوماً' : '14-Day Free Returns'}
                </Link>
              </li>
              <li>
                <Link href='/#shop-by-age' className='hover:text-white transition-colors'>
                  {isAr ? 'دليل وحاسبة المقاسات' : 'Size Calculator & Guide'}
                </Link>
              </li>
              <li>
                <Link href='/profile' className='hover:text-white transition-colors'>
                  {isAr ? 'حسابي وإعدادات الملف' : 'My Account & Settings'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ROAROSA Egypt */}
          <div className='space-y-3' data-aos='fade-up' data-aos-delay='400'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-[#E5C2AF]'>
              {isAr ? 'رواروسا مصر' : 'ROAROSA Egypt'}
            </h4>
            <div className='space-y-2.5 text-xs text-[#EBDED6]/80'>
              <div className='flex items-start gap-2'>
                <MapPin className='w-4 h-4 text-[#C48D80] flex-shrink-0 mt-0.5' />
                <span>{isAr ? 'فروع الزمالك والقاهرة الجديدة، مصر' : 'Zamalek & New Cairo Boutiques, Cairo, Egypt'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-[#C48D80] flex-shrink-0' />
                <span dir='ltr'>+20 (0) 120 728 6573</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4 text-[#C48D80] flex-shrink-0' />
                <span>care@roarosa.com</span>
              </div>
              <div className='flex items-center gap-2 pt-1'>
                <ShieldCheck className='w-4 h-4 text-[#E5C2AF]' />
                <span className='text-[11px] text-[#E5C2AF]'>
                  {isAr ? 'آمنة ومختبرة للبشرة الحساسة' : 'Sensitive-Skin Certified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Badges & Copyright */}
        <div className='pt-8 border-t border-[#3D332E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EBDED6]/60'>
          <p>
            &copy; 2026 ROAROSA Egypt. {isAr ? 'جميع الحقوق محفوظة. «الرقة ليست ضعفاً».' : 'All rights reserved. “Softness is not weakness”.'}
          </p>
          <div className='flex items-center gap-2 text-[11px] font-medium'>
            <span className='px-2 py-1 rounded bg-white/5 border border-white/10 text-white'>Visa</span>
            <span className='px-2 py-1 rounded bg-white/5 border border-white/10 text-white'>Mastercard</span>
            <span className='px-2 py-1 rounded bg-white/5 border border-white/10 text-white'>Meeza</span>
            <span className='px-2 py-1 rounded bg-white/5 border border-white/10 text-white'>ValU</span>
            <span className='px-2 py-1 rounded bg-white/5 border border-white/10 text-white'>{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
