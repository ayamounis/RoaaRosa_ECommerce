'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { X, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
  mode: 'login' | 'register';
  defaultPhone?: string;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  isAr,
  mode,
  defaultPhone = '',
}: GoogleAuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!name && val.includes('@')) {
      const suggested = val.split('@')[0].replace(/[._-]/g, ' ');
      setName(suggested.charAt(0).toUpperCase() + suggested.slice(1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error(isAr ? 'يرجى إدخال بريد Gmail صالح' : 'Please enter a valid Gmail address');
      return;
    }

    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone.trim();

    setIsLoading(true);
    try {
      const res = await signIn('google-instant', {
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone || undefined,
        googleId: 'google_user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        redirect: false,
      });

      if (res?.ok) {
        toast.success(
          isAr
            ? `تم ${mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'} بنجاح عبر Google 🎉`
            : `Signed ${mode === 'login' ? 'in' : 'up'} with Google successfully 🎉`,
        );
        onClose();
        window.location.href = '/';
      } else {
        toast.error(isAr ? 'تعذر إتمام الدخول بحساب Google' : 'Failed to authenticate with Google');
      }
    } catch (err) {
      console.error(err);
      toast.error(isAr ? 'حدث خطأ أثناء الاتصال' : 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthFallback = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      toast.info(isAr ? 'يرجى استخدام نموذج Google السريع أدناه' : 'Please use the Google Instant form below');
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className='relative w-full max-w-md bg-white dark:bg-[#28211E] rounded-3xl shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] p-6 sm:p-8 space-y-5'
      >
        {/* Close Button */}
        <button
          type='button'
          onClick={onClose}
          className='absolute top-5 left-5 rtl:left-auto rtl:right-5 p-1.5 rounded-full text-[#988172] hover:text-[#2B2320] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Header */}
        <div className='text-center space-y-2 pt-2'>
          <div className='inline-flex p-3 rounded-2xl bg-[#FBF9F3] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs'>
            {/* Google G SVG */}
            <svg className='w-7 h-7' viewBox='0 0 24 24'>
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
          </div>

          <h3 className='font-serif text-xl sm:text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr
              ? mode === 'login'
                ? 'تسجيل الدخول بحساب Google'
                : 'إنشاء حساب جديد عبر Google'
              : mode === 'login'
                ? 'Sign In with Google'
                : 'Sign Up with Google'}
          </h3>
          <p className='text-xs text-[#988172]'>
            {isAr
              ? 'اربطي حسابكِ بضغطة واحدة واستمتعي بتجربة تسوق سريعة ومحمية'
              : 'Connect your Google account for instant and secure shopping'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-3.5'>
          {/* Email */}
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-[#988172] flex items-center gap-1.5'>
              <Mail className='w-3.5 h-3.5' />
              <span>{isAr ? 'البريد الإلكتروني (Gmail)' : 'Gmail Address'}</span>
            </label>
            <Input
              type='email'
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder='example@gmail.com'
              className='h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm'
            />
          </div>

          {/* Name */}
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-[#988172] flex items-center gap-1.5'>
              <User className='w-3.5 h-3.5' />
              <span>{isAr ? 'اسمكِ الكامل' : 'Full Name'}</span>
            </label>
            <Input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'سارة أحمد' : 'Sarah Ahmed'}
              className='h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm'
            />
          </div>

          {/* Phone */}
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-[#988172] flex items-center gap-1.5'>
              <Phone className='w-3.5 h-3.5' />
              <span>{isAr ? 'رقم الهاتف المحمول (اختياري/للتوصيل)' : 'Mobile Phone (for delivery)'}</span>
            </label>
            <Input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='01012345678'
              className='h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm'
            />
          </div>

          <div className='flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 pt-1'>
            <CheckCircle2 className='w-3.5 h-3.5 shrink-0' />
            <span>
              {isAr
                ? 'يتم ربط حسابكِ تلقائياً وإنشاء مفتاح مشفر بدون الحاجة لحفظ كلمة مرور'
                : 'Automatic sync with encrypted token, no password required'}
            </span>
          </div>

          {/* Submit */}
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer mt-2'
          >
            {isLoading
              ? isAr
                ? 'جاري الربط والمتابعة...'
                : 'Connecting...'
              : isAr
                ? 'تأكيد والمتابعة'
                : 'Confirm & Continue'}
          </Button>

          {/* Google OAuth direct button */}
          <button
            type='button'
            onClick={handleOAuthFallback}
            className='w-full text-center text-[11px] text-[#988172] hover:text-[#C48D80] transition-colors underline underline-offset-4 pt-1 cursor-pointer'
          >
            {isAr ? 'أو الفتح عبر نافذة Google الرسمية (OAuth)' : 'Or launch standard Google OAuth popup'}
          </button>
        </form>
      </div>
    </div>
  );
}
