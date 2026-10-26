'use client';

import React from 'react';
import { IAddress } from '@/app/_interfaces/address';
import AddressList from './AddressList';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/_Components/ui/button';

export default function AddressPageView({ addresses }: { addresses: IAddress[] }) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm'>
      <div className='flex items-center justify-between pb-6 border-b border-[#EBDED6] dark:border-[#3D332E]'>
        <div>
          <h2 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'دفتر العناوين المحفوظة' : 'Saved Addresses'}
          </h2>
          <p className='text-xs text-[#988172] mt-1'>
            {isAr ? 'إدارة وتعديل عناوين التوصيل الخاصة بكِ' : 'Manage your saved delivery addresses'}
          </p>
        </div>
        <Button
          asChild
          variant='outline'
          className='rounded-xl border-[#C48D80] text-[#C48D80] hover:bg-[#C48D80] hover:text-white transition-colors text-xs font-semibold'
        >
          <Link href='/profile/address-book' className='flex items-center gap-1.5'>
            <Plus className='w-3.5 h-3.5' />
            <span>{isAr ? 'إضافة عنوان جديد' : 'Add New'}</span>
          </Link>
        </Button>
      </div>

      <div className='mt-6'>
        {addresses && addresses.length > 0 ? (
          <AddressList address={addresses} from="payment" />
        ) : (
          <div className='text-center py-12 space-y-4'>
            <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
              <MapPin className='w-7 h-7' />
            </div>
            <p className='text-sm text-[#988172] font-medium'>
              {isAr ? 'لا توجد عناوين مسجلة حتى الآن' : 'No addresses saved yet'}
            </p>
            <Button
              asChild
              className='rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold'
            >
              <Link href='/profile/address-book'>
                {isAr ? 'أضيفي عنوانكِ الأول الآن' : 'Add your first address'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
