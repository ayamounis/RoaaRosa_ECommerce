'use client';

import React from 'react';
import Link from 'next/link';
import { IOrder } from '@/app/_interfaces/order';
import OrderCard from '@/_Components/shared/OrderCard/OrderCard';
import { useLanguage } from '@/context/LanguageContext';
import { Package, Sparkles, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/_Components/ui/button';

export default function OrdersClientView({ orders }: { orders: IOrder[] }) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container max-w-5xl space-y-8'>
        {/* Header Breadcrumbs & Title */}
        <div className='pb-6 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80] flex items-center gap-1.5'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>{isAr ? 'سجل الطلبات والمشتريات' : 'Purchase History'}</span>
            </span>
            <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
              {isAr ? 'طلباتي السابقة' : 'My Orders'}
              <span className='text-lg font-sans font-normal text-[#988172] ml-2 mr-2'>
                ({orders.length} {isAr ? 'طلب' : orders.length === 1 ? 'order' : 'orders'})
              </span>
            </h1>
          </div>

          <Link
            href='/products'
            className='text-xs font-semibold text-[#988172] hover:text-[#C48D80] transition-colors flex items-center gap-1.5'
          >
            <span>{isAr ? 'تسوق قطع جديدة' : 'Shop New In'}</span>
            {isRtl ? <ArrowLeft className='w-3.5 h-3.5' /> : <ArrowRight className='w-3.5 h-3.5' />}
          </Link>
        </div>

        {/* Orders Content */}
        {orders.length > 0 ? (
          <div className='space-y-6'>
            {orders.map((order: IOrder) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))}
          </div>
        ) : (
          /* Empty Orders State */
          <div className='max-w-md mx-auto p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xl text-center space-y-6'>
            <div className='relative w-20 h-20 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
              <Package className='w-9 h-9' />
              <span className='absolute top-1 right-1 w-3 h-3 rounded-full bg-[#C48D80] ring-2 ring-white dark:ring-[#28211E]' />
            </div>

            <div className='space-y-2'>
              <h2 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'لا توجد طلبات سابقة حتى الآن' : 'No Orders Placed Yet'}
              </h2>
              <p className='text-xs sm:text-sm text-[#988172] leading-relaxed'>
                {isAr
                  ? 'لم تقومي بإنشاء أي طلبات حتى الآن. استكشفي أحدث تشكيلات ملابس البنات والفساتين لتجربة تسوق راقية.'
                  : 'You have not placed any orders yet. Discover our latest curated collections of girls dresses and sets.'}
              </p>
            </div>

            <Button
              asChild
              className='px-8 py-3.5 h-12 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs'
            >
              <Link href='/products' className='flex items-center gap-2'>
                <ShoppingBag className='w-4 h-4' />
                <span>{isAr ? 'ابدئي التسوق الآن' : 'Start Shopping'}</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
