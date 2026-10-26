'use client'
import PasswordInput from "@/_Components/shared/PasswordInput/PasswordInput";
import { Button } from "@/_Components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdatePassword } from "./updatePassword.action";
import { schemaUpdatePassword } from "./updatePassword.schema";
import { UpdatePasswordType } from "./updatePassword.types";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePasswordForm() {
    const { language, isRtl } = useLanguage();
    const isAr = language === 'ar';

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdatePasswordType>({
        defaultValues: {
            currentPassword: "",
            password: "",
            rePassword: "",
        },
        mode: 'onChange',
        resolver: zodResolver(schemaUpdatePassword),
    })

    const onSubmit = async (data: UpdatePasswordType) => {
        const res = await UpdatePassword(data)
        if (res.message === 'success') {
            await signOut({callbackUrl:'/login'})
            toast.success(isAr ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully')
            toast.success(isAr ? 'يرجى تسجيل الدخول بكلمة المرور الجديدة' : 'Please login with your new password')
        }
        else {
            toast.error(res?.errors?.msg || (isAr ? 'تعذر تحديث كلمة المرور' : 'Failed to update password'))
        }
    }

    return (
        <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                <h2 className="font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                </h2>
                <p className="text-xs text-[#988172] mt-1">
                    {isAr ? 'احرصي على استخدام كلمة مرور قوية لتأمين حسابكِ' : 'Ensure using a strong password to secure your account'}
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="currentPassword" className="text-text2 font-medium text-sm">
                            {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                        </label>
                        <PasswordInput {...register('currentPassword')} className="input-Form" />
                        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="password" className="text-text2 font-medium text-sm">
                            {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                        </label>
                        <PasswordInput placeholder={isAr ? 'كلمة المرور الجديدة' : 'New Password'} {...register('password')} className="input-Form" />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-end w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="rePassword" className="text-text2 font-medium text-sm">
                            {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                        </label>
                        <PasswordInput placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'} {...register('rePassword')} className="input-Form" />
                        {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                        <Button type="submit" className="button-primary rounded-xl px-8 h-11">
                            {isAr ? 'تحديث كلمة المرور' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => { reset() }}
                            variant="outline"
                            className="rounded-xl px-8 h-11 border-[#EBDED6] dark:border-[#3D332E]"
                        >
                            {isAr ? 'إلغاء' : 'Cancel'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
