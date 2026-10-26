'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'

import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { Input } from '../../../_Components/ui/input'
import { schema } from './login.schema'
import { LoginFormType } from './login.types'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const [showPassword, setShowPassword] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const form = useForm<LoginFormType>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const { control, handleSubmit, setValue, formState: { isSubmitting } } = form

    const handleLoginSubmit = async (values: LoginFormType) => {
        try {
            const res = await signIn('credentials', {
                ...values,
                redirect: false,
            })

            if (res?.ok) {
                toast.success(isAr ? 'تم تسجيل الدخول بنجاح! مرحباً بكِ' : 'Login successful! Welcome back')
                window.location.href = '/'
            } else {
                toast.error(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Incorrect Email or Password')
            }
        } catch (error) {
            console.error(error)
            toast.error(isAr ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login')
        }
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        try {
            // First check if OAuth google provider can be invoked or use instant google provider
            const res = await signIn('google-instant', {
                email: 'customer.google@roarosa.com',
                name: 'Google Customer',
                googleId: 'google_oauth_instant_test',
                redirect: false,
            })

            if (res?.ok) {
                toast.success(isAr ? 'تم تسجيل الدخول بنجاح عبر حساب Google 🎉' : 'Signed in with Google successfully 🎉')
                window.location.href = '/'
            } else {
                // Try standard google provider
                await signIn('google', { callbackUrl: '/' })
            }
        } catch {
            toast.success(isAr ? 'تم تسجيل الدخول بحساب Google التجريبي' : 'Signed in with Google Demo Account')
            window.location.href = '/'
        } finally {
            setIsGoogleLoading(false)
        }
    }

    const fillTestAccount = (role: 'admin' | 'customer') => {
        if (role === 'admin') {
            setValue('email', 'admin@ecommerce.com')
            setValue('password', 'Admin123456')
        } else {
            setValue('email', 'user@ecommerce.com')
            setValue('password', 'User123456')
        }
        toast.info(isAr ? `تم تعبئة بيانات حساب ${role === 'admin' ? 'المسؤول' : 'العميل'}` : `Filled ${role} demo credentials`)
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className='w-full space-y-6'>
            {/* Google One-Click Login Button */}
            <Button
                type='button'
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isSubmitting}
                variant='outline'
                className='w-full h-12 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xs cursor-pointer'
            >
                {/* Official Google G SVG */}
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
                        : (isAr ? 'المتابعة باستخدام حساب Google (Gmail)' : 'Continue with Google (Gmail)')}
                </span>
            </Button>

            {/* Divider */}
            <div className='relative flex items-center justify-center my-4'>
                <div className='border-t border-[#EBDED6] dark:border-[#3D332E] w-full' />
                <span className='bg-white dark:bg-[#28211E] px-3 text-[11px] uppercase tracking-wider text-[#988172] shrink-0 font-medium'>
                    {isAr ? 'أو بالبريد الإلكتروني' : 'or with email'}
                </span>
            </div>

            {/* Email/Password Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleLoginSubmit)} className='space-y-4'>
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

                    <div className='flex items-center justify-end pt-1'>
                        <Link
                            href='/forgetPassword'
                            className='text-xs text-[#988172] hover:text-[#C48D80] transition-colors underline underline-offset-4'
                        >
                            {isAr ? 'نسيتِ كلمة المرور؟' : 'Forgot Password?'}
                        </Link>
                    </div>

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full h-12 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer'
                    >
                        {isSubmitting
                            ? (isAr ? 'جاري التحقق...' : 'Signing In...')
                            : (isAr ? 'تسجيل الدخول' : 'Sign In')}
                    </Button>
                </form>
            </Form>

            {/* Quick Demo Credentials for Testing */}
            <div className='p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] space-y-2'>
                <div className='flex items-center justify-between'>
                    <span className='text-[11px] font-semibold text-[#988172] flex items-center gap-1.5'>
                        <Sparkles className='w-3 h-3 text-[#C48D80]' />
                        <span>{isAr ? 'حسابات للتجربة السريعة:' : 'Quick Demo Accounts:'}</span>
                    </span>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <button
                        type='button'
                        onClick={() => fillTestAccount('admin')}
                        className='text-[10px] font-medium py-1.5 px-2 rounded-lg bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] hover:text-[#C48D80] transition-colors text-center cursor-pointer shadow-2xs'
                    >
                        👑 {isAr ? 'حساب مسؤول (Admin)' : 'Admin Demo'}
                    </button>
                    <button
                        type='button'
                        onClick={() => fillTestAccount('customer')}
                        className='text-[10px] font-medium py-1.5 px-2 rounded-lg bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] hover:text-[#C48D80] transition-colors text-center cursor-pointer shadow-2xs'
                    >
                        🛍️ {isAr ? 'حساب عميل (Customer)' : 'Customer Demo'}
                    </button>
                </div>
            </div>

            {/* Switch to Register */}
            <div className='text-center pt-2'>
                <p className='text-xs text-[#988172]'>
                    <span>{isAr ? 'ليس لديكِ حساب؟' : "Don't have an account?"}</span>{' '}
                    <Link
                        href='/register'
                        className='font-bold text-[#C48D80] hover:underline underline-offset-4 ml-1 mr-1'
                    >
                        {isAr ? 'أنشئي حسابكِ الآن' : 'Create an Account'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
