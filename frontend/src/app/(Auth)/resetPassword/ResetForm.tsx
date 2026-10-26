'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { Input } from '../../../_Components/ui/input'
import { handleResetPassword } from './Reset.action'
import { ResetPasswordSchema } from './Reset.schema'
import { ResetPasswordFormType } from './Reset.types'
import PasswordInput from '@/_Components/shared/PasswordInput/PasswordInput'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useLanguage } from '@/context/LanguageContext'

export default function ResetPasswordForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const { email } = useSelector((state: RootState) => state.emailForget)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const RhfObj = useForm<ResetPasswordFormType>({
        resolver: zodResolver(ResetPasswordSchema),
    })
    const { control, handleSubmit } = RhfObj

    const ResetPasswordSubmit = async (values: ResetPasswordFormType) => {
        setLoading(true)
        const res = await handleResetPassword({ ...values, email })
        if (res.token) {
            toast.success(isAr ? 'تم إعادة تعيين كلمة المرور بنجاح' : 'Password reset successfully')
            router.push('/login')
        }
        else {
            toast.error(isAr ? 'تعذر إعادة تعيين كلمة المرور، يرجى المحاولة لاحقاً' : res.message)
            if (res.message === 'reset code not verified') {
                router.push('/forgetPassword')
            }
        }
        setLoading(false)
    }

    return (
        <Form {...RhfObj}>
            <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(ResetPasswordSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#988172]">
                        {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <Input
                        className="h-12 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm opacity-70 cursor-not-allowed"
                        type="email"
                        disabled
                        value={email}
                    />
                </div>

                <FormField
                    control={control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#988172]">
                                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                            </label>
                            <FormControl>
                                <PasswordInput
                                    className="h-12 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm"
                                    placeholder={isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-[11px] text-rose-500" />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer mt-4"
                    type="submit"
                >
                    {loading
                        ? (isAr ? 'جاري الحفظ...' : 'Resetting...')
                        : (isAr ? 'تعيين كلمة المرور الجديدة' : 'Reset Password')}
                </Button>
            </form>
        </Form>
    )
}
