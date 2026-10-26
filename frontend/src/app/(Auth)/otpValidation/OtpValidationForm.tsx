'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { otpValidationSchema } from './OtpValidation.schema'
import { handleOtpValidation } from './otpValidation.action'
import { OtpValidationFormType } from './otpValidation.types'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/_Components/ui/input-otp'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function OtpValidationForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const [loading, setLoading] = useState(false)
    const route = useRouter()
    const RhfObj = useForm<OtpValidationFormType>({
        resolver: zodResolver(otpValidationSchema),
    })
    const { control, handleSubmit } = RhfObj

    const OtpValidationSubmit = async (values: OtpValidationFormType) => {
        setLoading(true)
        const res = await handleOtpValidation(values)
        if (res.status === 'Success') {
            toast.success(isAr ? 'تم التحقق من الرمز بنجاح' : 'OTP validated successfully')
            route.push('/resetPassword')
        }
        else {
            toast.error(isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية' : res.message)
        }
        setLoading(false)
    }

    return (
        <Form {...RhfObj}>
            <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(OtpValidationSubmit)} className="space-y-6">
                <div>
                    <FormField
                        control={control}
                        name="resetCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP dir="ltr" value={field.value} onChange={field.onChange} maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                                        <InputOTPGroup className='w-full justify-center gap-2'>
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={0} />
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={1} />
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={2} />
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={3} />
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={4} />
                                            <InputOTPSlot className='w-12 h-14 font-bold rounded-xl border border-[#EBDED6] dark:border-[#3D332E] text-lg bg-[#FAF7F2] dark:bg-[#1F1917]' index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage className="text-[11px] text-rose-500 text-center" />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    disabled={loading}
                    className='w-full h-12 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer'
                    type='submit'
                >
                    {loading
                        ? (isAr ? 'جاري التحقق...' : 'Validating...')
                        : (isAr ? 'تأكيد الرمز والمتابعة' : 'Validate OTP')}
                </Button>

                <div className='text-center pt-2'>
                    <p className='text-xs text-[#988172]'>
                        <span>{isAr ? 'لم يصلكِ الرمز بعد؟' : "Didn't receive OTP?"}</span>{' '}
                        <Link
                            href='/forgetPassword'
                            className='font-bold text-[#C48D80] hover:underline underline-offset-4 ml-1 mr-1'
                        >
                            {isAr ? 'إعادة الإرسال' : 'Resend OTP'}
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    )
}
