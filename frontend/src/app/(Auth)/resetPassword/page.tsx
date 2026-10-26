'use client';

import React from 'react';
import Image from 'next/image';
import ResetForm from './ResetForm';
import { useLanguage } from '@/context/LanguageContext';

export default function ResetPassword() {
    const { language, isRtl } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div className='min-h-[85vh] py-10 sm:py-16 bg-[#FBF9F3] dark:bg-[#1F1917] flex items-center justify-center'>
            <div className='container max-w-4xl'>
                <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className='bg-white dark:bg-[#28211E] rounded-3xl shadow-xl border border-[#EBDED6] dark:border-[#3D332E] overflow-hidden grid grid-cols-1 md:grid-cols-12'
                >
                    <div className="relative hidden md:block md:col-span-5 bg-[#2B2320]">
                        <Image
                            className="object-cover h-full w-full opacity-80"
                            alt="Reset password"
                            src="/images/next/dresses-shop-now.jpg"
                            fill
                            sizes="400px"
                        />
                    </div>
                    <div className='md:col-span-7 p-8 sm:p-12 flex flex-col justify-center'>
                        <div className='mb-8'>
                            <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                                {isAr ? 'تعيين كلمة المرور الجديدة' : 'Reset Password'}
                            </h1>
                            <p className='mt-2 text-xs sm:text-sm text-[#988172]'>
                                {isAr
                                    ? 'أدخلي كلمة المرور الجديدة لتتمكني من تسجيل الدخول إلى حسابكِ'
                                    : 'Enter your new password to regain access to your account'}
                            </p>
                        </div>
                        <ResetForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
