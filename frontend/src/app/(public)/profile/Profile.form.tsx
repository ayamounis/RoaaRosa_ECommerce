'use client'
import { Button } from "@/_Components/ui/button";
import { Input } from "@/_Components/ui/input";
import { setUserInfo } from "@/redux/slices/userInfo";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { UpdateProfileInfo } from "./profile.action";
import { schema } from "./profile.schema";
import { profileSchema } from "./profile.types";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'

    const { data: userData, update } = useSession() || {}
    const email = userData?.user?.email || ''
    const name = userData?.user?.name || ''

    const userInfo = useSelector((state: RootState) => state.userInfo)

    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm({
        defaultValues: {
            name: "",
            phone: userInfo.phone || "",
        },
        mode: 'onChange',
        resolver: zodResolver(schema),
    })
    const ResetForm = () => {
        reset({
            name,
            phone: userInfo.phone || "",
        })
        clearErrors()
    }

    const onSubmit = async (data: profileSchema) => {
        const res = await UpdateProfileInfo(data)
        if (res.message === 'success') {
            dispatch(setUserInfo(data))
            await update({ name: data.name })
            toast.success(isAr ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully')
        }
        else {
            toast.error(isAr ? 'حدث خطأ ما أثناء التحديث' : 'Something went wrong')
        }
    }

    useEffect(() => {
        reset({
            name: name,
            phone: userInfo.phone
        })
    }, [name, reset, userInfo.phone])

    return (
        <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                <h2 className="font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'تعديل الملف الشخصي' : 'Edit Your Profile'}
                </h2>
                <p className="text-xs text-[#988172] mt-1">
                    {isAr ? 'تحديث وتعديل بياناتكِ الشخصية ورقم الهاتف' : 'Update your personal details and phone number'}
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="name" className="text-text2 font-medium text-sm">
                            {isAr ? 'الاسم بالكامل' : 'Name'}
                        </label>
                        <Input {...register("name")} type="text" className="input-Form" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="email-profile" className="text-text2 font-medium text-sm">
                            {isAr ? 'البريد الإلكتروني' : 'Email'}
                        </label>
                        <Input type="email" value={email || ""} disabled className="input-Form opacity-70 cursor-not-allowed" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-end w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="phone" className="text-text2 font-medium text-sm">
                            {isAr ? 'رقم الهاتف' : 'Phone'}
                        </label>
                        <Input {...register("phone")} type="text" className="input-Form" />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                        <Button type="submit" className="button-primary rounded-xl px-8 h-11">
                            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {ResetForm()}} 
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
