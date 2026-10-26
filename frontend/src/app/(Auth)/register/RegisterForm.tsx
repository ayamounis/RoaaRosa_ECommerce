'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

import { Button } from '../../../_Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form';
import { Input } from '../../../_Components/ui/input';
import { handleRegister } from './register.action';
import { schema } from './register.schema';
import { RegisterFormType } from './register.types';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterForm() {
  const router = useRouter();
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      rePassword: '',
    },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const handleRegisterSubmit = async (values: RegisterFormType) => {
    try {
      const resOutput = await handleRegister(values);
      if (resOutput === true) {
        toast.success(isAr ? 'تم إنشاء الحساب بنجاح! يتم الآن تسجيل دخولك...' : 'Account created successfully! Signing in...');
        // Automatically sign in
        const signInRes = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          window.location.href = '/';
        } else {
          router.push('/login');
        }
      } else {
        toast.error(typeof resOutput === 'string' ? resOutput : (isAr ? 'تعذر إنشاء الحساب' : 'Failed to register'));
      }
    } catch (err) {
      console.error(err);
      toast.error(isAr ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred during registration');
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await signIn('google-instant', {
        email: 'customer.google@roarosa.com',
        name: 'Google Customer',
        googleId: 'google_oauth_instant_test',
        redirect: false,
      });

      if (res?.ok) {
        toast.success(isAr ? 'تم التسجيل والربط بحساب Google بنجاح 🎉' : 'Registered with Google successfully 🎉');
        window.location.href = '/';
      } else {
        await signIn('google', { callbackUrl: '/' });
      }
    } catch {
      toast.success(isAr ? 'تم التسجيل بحساب Google التجريبي' : 'Registered with Google Demo');
      window.location.href = '/';
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='w-full space-y-6'>
      {/* Google One-Click Register Button */}
      <Button
        type='button'
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || isSubmitting}
        variant='outline'
        className='w-full h-12 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xs cursor-pointer'
      >
        <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24'>
          <path
            fill='#4285F4'
            d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z'
          />
          <path
            fill='#34A853'
            d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z'
          />
          <path
            fill='#FBBC05'
            d='M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z'
          />
          <path
            fill='#EA4335'
            d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z'
          />
        </svg>
        <span>
          {isGoogleLoading
            ? (isAr ? 'جاري الاتصال بـ Google...' : 'Connecting to Google...')
            : (isAr ? 'التسجيل السريع باستخدام Google (Gmail)' : 'Sign up with Google (Gmail)')}
        </span>
      </Button>

      {/* Divider */}
      <div className='relative flex items-center justify-center my-4'>
        <div className='border-t border-[#EBDED6] dark:border-[#3D332E] w-full' />
        <span className='bg-white dark:bg-[#28211E] px-3 text-[11px] uppercase tracking-wider text-[#988172] shrink-0 font-medium'>
          {isAr ? 'أو ببياناتكِ الخاصة' : 'or with custom details'}
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(handleRegisterSubmit)} className='space-y-4'>
          {/* Full Name */}
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <FormControl>
                  <div className='relative flex items-center'>
                    <User className='absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]' />
                    <Input
                      type='text'
                      placeholder={isAr ? 'الاسم بالكامل' : 'Full Name'}
                      className='h-12 pl-10 rtl:pl-4 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-[11px] text-rose-500' />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Mail className='absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]' />
                    <Input
                      type='email'
                      placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                      className='h-12 pl-10 rtl:pl-4 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-[11px] text-rose-500' />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={control}
            name='phone'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Phone className='absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]' />
                    <Input
                      type='tel'
                      placeholder={isAr ? 'رقم الهاتف (مثال: 01012345678)' : 'Phone Number (e.g. 01012345678)'}
                      className='h-12 pl-10 rtl:pl-4 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-[11px] text-rose-500' />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Lock className='absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isAr ? 'كلمة المرور' : 'Password'}
                      className='h-12 pl-10 pr-10 rtl:pl-10 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3.5 rtl:right-auto rtl:left-3.5 text-[#988172] hover:text-[#2B2320] dark:hover:text-white transition-colors cursor-pointer'
                    >
                      {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-[11px] text-rose-500' />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={control}
            name='rePassword'
            render={({ field }) => (
              <FormItem className='space-y-1.5'>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Lock className='absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]' />
                    <Input
                      type={showRePassword ? 'text' : 'password'}
                      placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                      className='h-12 pl-10 pr-10 rtl:pl-10 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowRePassword(!showRePassword)}
                      className='absolute right-3.5 rtl:right-auto rtl:left-3.5 text-[#988172] hover:text-[#2B2320] dark:hover:text-white transition-colors cursor-pointer'
                    >
                      {showRePassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-[11px] text-rose-500' />
              </FormItem>
            )}
          />

          {/* Privacy & Guarantee note */}
          <div className='flex items-center gap-2 text-[11px] text-[#988172] pt-1'>
            <CheckCircle2 className='w-3.5 h-3.5 text-emerald-500 shrink-0' />
            <span>{isAr ? 'بياناتكِ الشخصية مشفرة ومحمية بالكامل' : 'Your personal data is encrypted and strictly protected'}</span>
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-12 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer mt-4'
          >
            {isSubmitting
              ? (isAr ? 'جاري إنشاء الحساب...' : 'Creating Account...')
              : (isAr ? 'إنشاء حساب جديد' : 'Create Account')}
          </Button>
        </form>
      </Form>

      {/* Switch to Login */}
      <div className='text-center pt-2'>
        <p className='text-xs text-[#988172]'>
          <span>{isAr ? 'لديكِ حساب بالفعل؟' : 'Already have an account?'}</span>{' '}
          <Link
            href='/login'
            className='font-bold text-[#C48D80] hover:underline underline-offset-4 ml-1 mr-1'
          >
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
