'use client'
import { setEmail } from '@/redux/slices/EmailForgetSlice'
import { AppDispatch } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { Input } from '../../../_Components/ui/input'
import { handleForgetPassword } from './forget.action'
import { schema } from './forget.schema'
import { ForgetFormType } from './forget.types'
import { useLanguage } from '@/context/LanguageContext'
import { Mail } from 'lucide-react'

export default function ForgetForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const RhfObj = useForm<ForgetFormType>({
        resolver: zodResolver(schema),
    })
    const { control, handleSubmit } = RhfObj

    const ForgetSubmit = async (values: ForgetFormType) => {
        setLoading(true)
        const res = await handleForgetPassword(values)

        if (res.statusMsg === 'success') {
            toast.success(isAr ? 'تم إرسال كود التحقق بنجاح إلى بريدكِ' : res.message)
            dispatch(setEmail(values.email))
            router.push('/otpValidation')
        }
        else {
            toast.error(isAr ? 'تعذر إرسال الرمز، يرجى التأكد من البريد الإلكتروني' : res.message)
        }
        setLoading(false)
    }

    return (
        <Form {...RhfObj}>
            <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(ForgetSubmit)} className="space-y-4">
                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormControl>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-[#988172]" />
                                    <Input
                                        className="h-12 pl-10 rtl:pl-4 rtl:pr-10 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] focus-visible:ring-[#C48D80] text-xs sm:text-sm"
                                        type="email"
                                        placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-[11px] text-rose-500" />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={!RhfObj.formState.isValid || loading}
                    className="w-full h-12 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer mt-4"
                    type="submit"
                >
                    {loading
                        ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                        : (isAr ? 'إرسال رمز التحقق' : 'Send Reset Code')}
                </Button>

                <div className="text-center pt-2">
                    <p className="text-xs text-[#988172]">
                        <span>{isAr ? 'تذكرتِ كلمة المرور؟' : 'Remembered your password?'}</span>{' '}
                        <Link
                            href="/login"
                            className="font-bold text-[#C48D80] hover:underline underline-offset-4 ml-1 mr-1"
                        >
                            {isAr ? 'تسجيل الدخول' : 'Sign In'}
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    )
}
