'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { ItemType } from './page';
import Incrementer from '@/_Components/shared/Incrementer/Incrementer';
import RemoveCartBtn from './RemoveCartBtn';
import ClearCartBtn from './ClearCartBtn';
import { Button } from '@/_Components/ui/button';

export interface CartContentProps {
  initialProducts: ItemType[];
  initialTotalPrice: number;
}

export default function CartContent({
  initialProducts,
  initialTotalPrice,
}: CartContentProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const totalCartPrice = initialTotalPrice;
  const products = initialProducts;

  // Free shipping threshold: 1,500 EGP
  const FREE_SHIPPING_THRESHOLD = 1500;
  const deliveryFee = totalCartPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 60;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalCartPrice);
  const progressPercent = Math.min(100, Math.round((totalCartPrice / FREE_SHIPPING_THRESHOLD) * 100));

  const finalTotal = Math.max(0, totalCartPrice - appliedDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      if (code === 'ROAROSA10' || code === 'WELCOME10') {
        const disc = Math.round(totalCartPrice * 0.1);
        setAppliedDiscount(disc);
        setDiscountPercent(10);
        toast.success(isAr ? 'تم تطبيق خصم 10% بنجاح! 🎉' : '10% discount applied successfully! 🎉');
      } else if (code === 'ROAROSA20' || code === 'SUMMER20') {
        const disc = Math.round(totalCartPrice * 0.2);
        setAppliedDiscount(disc);
        setDiscountPercent(20);
        toast.success(isAr ? 'تم تطبيق خصم 20% رائع! 🎉' : '20% super discount applied! 🎉');
      } else {
        toast.error(isAr ? 'كوبون الخصم غير صحيح أو منتهي الصلاحية' : 'Coupon code is invalid or expired');
      }
    }, 400);
  };

  if (products.length <= 0) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className='container py-16 sm:py-24 text-center'>
        <div className='max-w-lg mx-auto p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xl space-y-6'>
          <div className='relative w-20 h-20 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80] shadow-xs'>
            <ShoppingBag className='w-9 h-9' />
            <span className='absolute top-1 right-1 w-3 h-3 rounded-full bg-[#C48D80] ring-2 ring-white dark:ring-[#28211E]' />
          </div>

          <div className='space-y-2'>
            <span className='text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C48D80]'>
              ROAROSA Shopping Bag
            </span>
            <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'حقيبة التسوق فارغة حالياً' : 'Your Shopping Bag is Empty'}
            </h1>
            <p className='text-xs sm:text-sm text-[#988172] max-w-sm mx-auto leading-relaxed'>
              {isAr
                ? 'استكشفي تشكيلاتنا الراقية من فساتين البنات، التريكو، وملابس المناسبات لملء حقيبتكِ بأرق القطع والتصميمات.'
                : 'Explore our curated girls’ dresses, knitwear, and occasion collections to fill your bag with gentle essentials.'}
            </p>
          </div>

          {/* Quick Category Suggestions */}
          <div className='pt-2'>
            <p className='text-xs font-semibold text-[#988172] uppercase tracking-wider mb-3'>
              {isAr ? 'أقسام مقترحة للتسوق:' : 'Suggested Categories:'}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {[
                { label: isAr ? 'الفساتين 👗' : 'Dresses', href: '/products?category=dresses' },
                { label: isAr ? 'وصل حديثاً ✨' : 'New In', href: '/products?sort=-createdAt' },
                { label: isAr ? 'التريكو والصوف 🧶' : 'Knitwear', href: '/products?category=knitwear' },
                { label: isAr ? 'أطقم وتنسيقات 🎀' : 'Sets & Outfits', href: '/products?category=sets' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className='text-xs font-medium px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] hover:text-[#C48D80] transition-colors'
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className='pt-4'>
            <Button
              asChild
              className='px-8 py-3.5 h-12 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs'
            >
              <Link href='/products'>
                <span>{isAr ? 'ابدئي التسوق الآن' : 'Start Shopping'}</span>
                {isRtl ? <ArrowLeft className='w-4 h-4 mr-2' /> : <ArrowRight className='w-4 h-4 ml-2' />}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container max-w-7xl'>
        {/* 3-Step Checkout Stepper */}
        <div className="mb-6 p-4 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {/* Step 1: Cart (Active) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[#2B2320] dark:text-[#FAF6F0]">
              <span className="w-6 h-6 rounded-full bg-[#C48D80] text-white flex items-center justify-center text-[11px] font-bold">
                ١
              </span>
              <span className="font-bold">{isAr ? '١. حقيبة التسوق' : '1. Shopping Bag'}</span>
            </div>

            {/* Step 2: Checkout */}
            <Link
              href="/cart/payment"
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl text-[#988172] hover:text-[#C48D80] transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] flex items-center justify-center text-[11px] font-bold border border-[#EBDED6] dark:border-[#3D332E]">
                ٢
              </span>
              <span className="font-medium">{isAr ? '٢. تفاصيل الشحن والطلب' : '2. Shipping & Order'}</span>
            </Link>

            {/* Step 3: Kashier Payment */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl text-[#988172]">
              <span className="w-6 h-6 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] flex items-center justify-center text-[11px] font-bold border border-[#EBDED6] dark:border-[#3D332E]">
                ٣
              </span>
              <span className="font-medium">{isAr ? '٣. بوابة الدفع كاشير' : '3. Kashier Payment'}</span>
            </div>
          </div>
        </div>

        {/* Header Breadcrumb */}
        <div className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80] flex items-center gap-1.5'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>{isAr ? 'مراجعة المشتريات وإتمام الطلب' : 'Review & Checkout'}</span>
            </span>
            <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
              {isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
              <span className='text-lg font-sans font-normal text-[#988172] ml-2 mr-2'>
                ({products.length} {isAr ? 'قطع' : products.length === 1 ? 'item' : 'items'})
              </span>
            </h1>
          </div>

          <Link
            href='/products'
            className='text-xs font-semibold text-[#988172] hover:text-[#C48D80] transition-colors flex items-center gap-1.5'
          >
            <span>{isAr ? 'متابعة التسوق' : 'Continue Shopping'}</span>
            {isRtl ? <ArrowLeft className='w-3.5 h-3.5' /> : <ArrowRight className='w-3.5 h-3.5' />}
          </Link>
        </div>

        {/* Free Shipping Motivational Bar */}
        <div className='mb-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2.5'>
          <div className='flex items-center justify-between text-xs font-medium'>
            <div className='flex items-center gap-2'>
              <Truck className='w-4 h-4 text-[#C48D80]' />
              <span>
                {remainingForFreeShipping > 0 ? (
                  isAr ? (
                    <>
                      أضيفي منتجات بقيمة <strong className='text-[#C48D80] font-bold'>{remainingForFreeShipping} ج.م</strong> للحصول على <strong className='text-[#2B2320] dark:text-white'>شحن سريع مجاني</strong>!
                    </>
                  ) : (
                    <>
                      Add <strong className='text-[#C48D80] font-bold'>{remainingForFreeShipping} EGP</strong> more for <strong className='text-[#2B2320] dark:text-white'>FREE Express Shipping</strong>!
                    </>
                  )
                ) : (
                  <span className='text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5'>
                    <CheckCircle2 className='w-4 h-4' />
                    <span>{isAr ? '🎉 مبروك! لقد حصلتِ على شحن سريع مجاني لطلبكِ!' : '🎉 Congratulations! You have unlocked FREE Express Shipping!'}</span>
                  </span>
                )}
              </span>
            </div>
            <span className='font-bold text-[#988172]'>{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className='w-full h-2 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] overflow-hidden'>
            <div
              style={{ width: `${progressPercent}%` }}
              className='h-full rounded-full bg-gradient-to-r from-[#C48D80] to-[#E5C2AF] transition-all duration-500'
            />
          </div>
        </div>

        {/* Grid Layout: Items List & Order Summary */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Items List (8 Columns) */}
          <div className='lg:col-span-8 space-y-4'>
            {products.map((item) => {
              const product = item.product;
              const prodId = product._id || product.id;
              return (
                <div
                  key={item._id}
                  className='p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition-shadow duration-200'
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/productDetails/${prodId}`}
                    className='relative w-28 h-36 rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#1F1917] shrink-0'
                  >
                    {product.imageCover && (
                      <Image
                        src={product.imageCover}
                        fill
                        alt={product.title}
                        className='object-cover object-top hover:scale-105 transition-transform duration-300'
                        sizes='112px'
                      />
                    )}
                  </Link>

                  {/* Info & Price */}
                  <div className='flex-1 w-full flex flex-col sm:flex-row justify-between gap-4'>
                    <div className='space-y-1.5'>
                      <span className='text-[10px] font-semibold uppercase tracking-wider text-[#988172]'>
                        {product.category?.name || 'ROAROSA Girls'}
                      </span>
                      <Link href={`/productDetails/${prodId}`}>
                        <h2 className='text-sm sm:text-base font-semibold text-[#2B2320] dark:text-[#FAF6F0] hover:text-[#C48D80] transition-colors line-clamp-2'>
                          {product.title}
                        </h2>
                      </Link>
                      <div className='flex items-center gap-2 pt-1'>
                        <span className='text-xs font-bold text-[#C48D80]'>
                          {item.price} EGP
                        </span>
                        {product.brand?.name && (
                          <span className='text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border border-[#EBDED6] dark:border-[#3D332E]'>
                            {product.brand.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Total */}
                    <div className='flex sm:flex-col justify-between items-end gap-3 shrink-0'>
                      <div className='flex items-center gap-3'>
                        <Incrementer count={item.count} id={item._id} />
                        <RemoveCartBtn id={item._id} />
                      </div>
                      <div className='text-right rtl:text-left'>
                        <p className='text-xs text-[#988172]'>
                          {item.price} EGP × {item.count}
                        </p>
                        <p className='text-sm sm:text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                          {item.price * item.count} EGP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Card (4 Columns) */}
          <div className='lg:col-span-4 sticky top-28 p-6 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xl space-y-6'>
            <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0] pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </h3>

            {/* Coupon Application Box */}
            <form onSubmit={handleApplyCoupon} className='space-y-2'>
              <label className='text-xs font-semibold text-[#988172] block'>
                {isAr ? 'هل لديكِ كود خصم؟' : 'Have a coupon code?'}
              </label>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <Tag className='w-4 h-4 text-[#988172] absolute left-3 rtl:left-auto rtl:right-3 top-3' />
                  <input
                    type='text'
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={isAr ? 'كود الخصم (ROAROSA10)' : 'Promo Code (ROAROSA10)'}
                    className='w-full h-10 pl-9 rtl:pl-3 rtl:pr-9 pr-3 rounded-xl text-xs bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] uppercase font-mono tracking-wider focus:outline-none focus:border-[#C48D80] text-[#2B2320] dark:text-[#FAF6F0]'
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  variant='outline'
                  className='h-10 px-4 rounded-xl text-xs font-semibold border-[#C48D80] text-[#C48D80] hover:bg-[#C48D80] hover:text-white transition-colors cursor-pointer'
                >
                  {isApplyingCoupon ? '...' : isAr ? 'تطبيق' : 'Apply'}
                </Button>
              </div>

              {/* Quick Coupon Hint */}
              <div className='text-[10px] text-[#988172] flex items-center justify-between pt-0.5'>
                <span>{isAr ? 'جربي كود:' : 'Try code:'} <strong className='text-[#C48D80]'>ROAROSA10</strong></span>
                <span className='text-emerald-600 font-semibold'>{isAr ? 'خصم 10%' : '10% OFF'}</span>
              </div>
            </form>

            {/* Price Breakdown */}
            <div className='space-y-2.5 text-xs pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              <div className='flex justify-between text-[#988172]'>
                <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className='font-medium text-[#2B2320] dark:text-white'>{totalCartPrice} EGP</span>
              </div>

              {appliedDiscount > 0 && (
                <div className='flex justify-between text-emerald-600 dark:text-emerald-400 font-medium'>
                  <span>{isAr ? `خصم الكوبون (${discountPercent}%)` : `Coupon Discount (${discountPercent}%)`}</span>
                  <span>-{appliedDiscount} EGP</span>
                </div>
              )}

              <div className='flex justify-between text-[#988172]'>
                <span>{isAr ? 'رسوم التوصيل والشحن' : 'Delivery & Shipping'}</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-[#C48D80]'}`}>
                  {deliveryFee === 0
                    ? (isAr ? 'شحن سريع مجاني' : 'Free Express')
                    : '60 EGP'}
                </span>
              </div>

              <div className='flex justify-between text-[#988172]'>
                <span>{isAr ? 'الضرائب والرسوم' : 'Taxes & Duties'}</span>
                <span className='font-medium text-[#2B2320] dark:text-white'>{isAr ? 'شاملة' : 'Included'}</span>
              </div>
            </div>

            {/* Total Price */}
            <div className='flex justify-between items-baseline'>
              <div>
                <span className='font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0] block'>
                  {isAr ? 'الإجمالي النهائي' : 'Total'}
                </span>
                <span className='text-[10px] text-[#988172]'>
                  {isAr ? 'شامل كافة الرسوم' : 'All taxes and shipping included'}
                </span>
              </div>
              <span className='font-serif text-3xl font-bold text-[#C48D80]'>
                {finalTotal} <span className='text-xs font-sans font-normal text-[#988172]'>EGP</span>
              </span>
            </div>

            {/* Checkout Action Button */}
            <Button
              asChild
              className='w-full h-12 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer'
            >
              <Link href='/cart/payment'>
                <span>{isAr ? 'متابعة الشحن وإتمام الطلب (Checkout)' : 'Proceed to Checkout & Shipping'}</span>
                {isRtl ? <ArrowLeft className='w-4 h-4' /> : <ArrowRight className='w-4 h-4' />}
              </Link>
            </Button>

            {/* Clear Bag Button */}
            <ClearCartBtn />

            {/* Security Badges */}
            <div className='pt-4 border-t border-[#EBDED6] dark:border-[#3D332E] space-y-2 text-[11px] text-[#988172]'>
              <div className='flex items-center gap-2'>
                <ShieldCheck className='w-4 h-4 text-emerald-500 shrink-0' />
                <span>{isAr ? 'دفع إلكتروني آمن 100% ومشفر' : '100% Secure & Encrypted Checkout'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Truck className='w-4 h-4 text-[#C48D80] shrink-0' />
                <span>{isAr ? 'شحن سريع لكافة محافظات مصر' : 'Fast Delivery to all Egyptian Governorates'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <RotateCcw className='w-4 h-4 text-blue-500 shrink-0' />
                <span>{isAr ? 'إرجاع واستبدال مجاني خلال 14 يوماً' : '14-Day Hassle-Free Returns'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
