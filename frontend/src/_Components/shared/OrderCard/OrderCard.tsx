'use client';

import React from 'react';
import Image from 'next/image';
import moment from 'moment';
import { ICartItem, IOrder } from '@/app/_interfaces/order';
import { useLanguage } from '@/context/LanguageContext';
import { PackageCheck, Clock, MapPin, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderCard({ order }: { order: IOrder }) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const {
    cartItems,
    createdAt,
    shippingPrice,
    totalOrderPrice,
    paymentMethodType,
    isPaid,
    shippingAddress,
    id,
  } = order;

  const currencyLabel = isAr ? 'ج.م' : 'EGP';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className='p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5'
    >
      {/* Top Header: Order ID & Status */}
      <div className='flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
        <div className='flex items-center gap-2.5'>
          <div className='w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80]'>
            <PackageCheck className='w-5 h-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-serif text-base sm:text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'طلب رقم' : 'Order'}
              </span>
              <span className='text-xs sm:text-sm font-mono font-bold text-[#C48D80] bg-[#FAF7F2] dark:bg-[#1F1917] px-2.5 py-0.5 rounded-full border border-[#EBDED6] dark:border-[#3D332E]'>
                #{id}
              </span>
            </div>
            <p className='text-[11px] text-[#988172] flex items-center gap-1 mt-0.5'>
              <Clock className='w-3 h-3' />
              <span>{moment(createdAt).format('YYYY-MM-DD • hh:mm A')}</span>
            </p>
          </div>
        </div>

        {/* Payment Status Pill */}
        <div>
          {isPaid ? (
            <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full'>
              <CheckCircle2 className='w-3.5 h-3.5' />
              <span>{isAr ? 'مدفوع بنجاح' : 'Paid'}</span>
            </span>
          ) : (
            <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full'>
              <AlertCircle className='w-3.5 h-3.5' />
              <span>{isAr ? 'الدفع عند الاستلام' : 'Pay on Delivery'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Order Items List */}
      <div className='space-y-3 max-h-60 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1'>
        {cartItems?.map((item: ICartItem) => {
          const product = item.product;
          if (!product) return null;
          return (
            <div
              key={item._id || product._id}
              className='p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center gap-3.5'
            >
              <div className='relative w-14 h-16 rounded-xl overflow-hidden bg-white dark:bg-[#28211E] shrink-0 border border-[#EBDED6] dark:border-[#3D332E]'>
                {product.imageCover && (
                  <Image
                    src={product.imageCover}
                    alt={product.title || 'Product'}
                    fill
                    className='object-cover object-top'
                    sizes='56px'
                  />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-xs sm:text-sm font-semibold text-[#2B2320] dark:text-[#FAF6F0] truncate'>
                  {product.title}
                </h4>
                <div className='flex items-center gap-3 text-xs text-[#988172] mt-1'>
                  <span>
                    {isAr ? 'الكمية:' : 'Qty:'}{' '}
                    <strong className='text-[#2B2320] dark:text-white font-bold'>{item.count}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {isAr ? 'سعر القطعة:' : 'Unit Price:'}{' '}
                    <strong className='text-[#C48D80] font-bold'>
                      {item.price} {currencyLabel}
                    </strong>
                  </span>
                </div>
              </div>
              <div className='text-right rtl:text-left shrink-0'>
                <span className='text-xs sm:text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {item.price * item.count} {currencyLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Financials & Shipping Info */}
      <div className='pt-3 border-t border-[#EBDED6] dark:border-[#3D332E] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
        {/* Left: Summary */}
        <div className='space-y-1.5 text-[#988172]'>
          <div className='flex items-center gap-2'>
            <CreditCard className='w-3.5 h-3.5 text-[#C48D80]' />
            <span>
              {isAr ? 'طريقة الدفع:' : 'Payment Method:'}{' '}
              <strong className='text-[#2B2320] dark:text-white'>
                {paymentMethodType === 'cash' || paymentMethodType === 'Cash'
                  ? isAr
                    ? 'نقداً عند الاستلام'
                    : 'Cash on Delivery'
                  : isAr
                  ? 'بطاقة بنكية / فيزا'
                  : 'Credit Card / Online'}
              </strong>
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span>{isAr ? 'رسوم الشحن والتوصيل:' : 'Shipping Fee:'}</span>
            <strong className='text-[#2B2320] dark:text-white'>
              {shippingPrice > 0 ? `${shippingPrice} ${currencyLabel}` : isAr ? 'مجاني' : 'Free'}
            </strong>
          </div>
        </div>

        {/* Right: Shipping Address & Total */}
        <div className='flex flex-col justify-between sm:items-end gap-2'>
          {shippingAddress && (
            <div className='flex items-start sm:justify-end gap-1.5 text-[#988172]'>
              <MapPin className='w-3.5 h-3.5 text-[#C48D80] shrink-0 mt-0.5' />
              <span className='line-clamp-1'>
                {shippingAddress.city ? `${shippingAddress.city} - ` : ''}
                {shippingAddress.details}
              </span>
            </div>
          )}
          <div className='flex items-baseline gap-2'>
            <span className='font-serif text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'الإجمالي النهائي:' : 'Total:'}
            </span>
            <span className='font-serif text-xl font-bold text-[#C48D80]'>
              {totalOrderPrice} <span className='text-xs font-sans font-normal text-[#988172]'>{currencyLabel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}