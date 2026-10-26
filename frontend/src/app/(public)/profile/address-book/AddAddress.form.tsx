'use client'
import { Button } from "@/_Components/ui/button";
import { Input } from "@/_Components/ui/input";
import { Textarea } from "@/_Components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddAddress } from "./addAddress.action";
import { addAddressSchema } from "./addAddress.schema";
import { addAddress } from "./addAddress.types";
import { useLanguage } from "@/context/LanguageContext";

export default function AddAddressForm() {
    const { language, isRtl } = useLanguage();
    const isAr = language === 'ar';

    const { register, handleSubmit, formState: { errors }, reset } = useForm<addAddress>({
        defaultValues: {
            name: "",
            details: "",
            phone: "",
            city: "",
        },
        mode: 'onChange',
        resolver: zodResolver(addAddressSchema),
    })

    const onSubmit = async (data: addAddress) => {
        const res = await AddAddress(data)
        if (res.status === 'success') {
            reset()
            toast.success(isAr ? 'تمت إضافة العنوان بنجاح' : res.message)
        }
        else {
            toast.error(isAr ? 'تعذر إضافة العنوان' : res.message)
        }
    }

    return (
        <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                <h2 className="font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'إضافة عنوان جديد' : 'Add New Address'}
                </h2>
                <p className="text-xs text-[#988172] mt-1">
                    {isAr ? 'أدخلي تفاصيل عنوان التوصيل الجديد' : 'Enter your new delivery address details'}
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="name" className="text-text2 font-medium text-sm">
                            {isAr ? 'اسم العنوان (المنزل، المكتب)' : 'Name (Home, Office)'}
                        </label>
                        <Input
                            {...register("name")}
                            placeholder={isAr ? 'مثال: المنزل، العمل' : 'Work, Office, Home'}
                            type="text"
                            className="input-Form"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="phone" className="text-text2 font-medium text-sm">
                            {isAr ? 'رقم الهاتف' : 'Phone'}
                        </label>
                        <Input
                            {...register("phone")}
                            placeholder={isAr ? '01012345678' : '01012345678'}
                            type="text"
                            className="input-Form"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-6 w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="details" className="text-text2 font-medium text-sm">
                            {isAr ? 'تفاصيل العنوان' : 'Details'}
                        </label>
                        <Textarea
                            rows={4}
                            cols={6}
                            placeholder={isAr ? 'الشارع، رقم المبنى، الشقة...' : 'Address Details...'}
                            {...register("details")}
                            className="input-Form resize-none max-w-100"
                        />
                        {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="city" className="text-text2 font-medium text-sm">
                            {isAr ? 'المدينة / المحافظة' : 'City'}
                        </label>
                        <Input
                            {...register("city")}
                            placeholder={isAr ? 'القاهرة' : 'Cairo'}
                            type="text"
                            className="input-Form"
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end w-full gap-2">
                    <Button type="submit" className="button-primary rounded-xl px-8 h-11">
                        {isAr ? 'إضافة العنوان' : 'Add Address'}
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
        </form>
    )
}
