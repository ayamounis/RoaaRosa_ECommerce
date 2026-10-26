'use client'

import CheckoutCard from "@/_Components/shared/CheckoutCard/CheckoutCard"
import { Button } from "@/_Components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/_Components/ui/form"
import { Input } from "@/_Components/ui/input"
import { Label } from "@/_Components/ui/label"
import { Separator } from "@/_Components/ui/separator"
import { IProductCart } from "@/app/_interfaces/Cart"
import { getUserCart } from "@/app/_services/cart.services"
import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import Bank from '@images/banksLogo.png'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { CreateCashOrder, CreateOnlineOrder } from "./payment.actions"
import { paymentSchema } from "./payment.schema"
import { paymentTypes } from "./payment.types"
import { useLanguage } from "@/context/LanguageContext"
import { CreditCard, Banknote, ShieldCheck, MapPin } from "lucide-react"

export default function PaymentForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const currencyLabel = isAr ? 'ج.م' : 'EGP'

    const [cartId, setCartId] = useState<string | null>(null)
    const [cartProducts, setCartProducts] = useState<IProductCart[]>([])
    const { _id, city, details, phone } = useSelector((state: RootState) => state.address)
    const [cartTotal, setCartTotal] = useState<number>(0)
    const [isCash, setIsCash] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const route = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const RhfObj = useForm<paymentTypes>({
        resolver: zodResolver(paymentSchema)
    })
    const { control, handleSubmit, setValue } = RhfObj

    async function handlePayment(values: paymentTypes) {
        setIsSubmitting(true)
        try {
            if (isCash) {
                const res = await CreateCashOrder(cartId!, values)
                if (res.status === 'success') {
                    toast.success(isAr ? 'تم إنشاء الطلب بنجاح! شكراً لتسوقكِ معنا' : 'Order Created Successfully!')
                    route.push('/allorders')
                    dispatch(updateCartCountAsync())
                } else {
                    toast.error(isAr ? 'تعذر إنشاء الطلب، يرجى المحاولة لاحقاً' : 'Failed to Create Order')
                }
            } else {
                const res = await CreateOnlineOrder(cartId!, values)
                if (res?.status === 'success') {
                    sessionStorage.setItem('fromCheckout', 'true')
                    window.location.href = res?.session?.url
                } else {
                    toast.error(isAr ? 'تعذر التحويل لبوابة الدفع، يرجى المحاولة لاحقاً' : 'Failed to Create Order')
                }
            }
        } catch {
            toast.error(isAr ? 'حدث خطأ أثناء معالجة الطلب' : 'An error occurred during order processing')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function getUserCartInfo() {
        const res = await getUserCart()
        if (res.status === 'success') {
            setCartId(res.cartId)
            setCartProducts(res.data.products)
            setCartTotal(res.data.totalCartPrice)
        }
    }

    useEffect(() => {
        getUserCartInfo()
    }, [])

    useEffect(() => {
        if (_id) {
            setValue('city', city)
            setValue('phone', phone)
            setValue('details', details)
        }
    }, [_id, city, details, phone, setValue])

    return (
        <Form {...RhfObj}>
            <form
                dir={isRtl ? 'rtl' : 'ltr'}
                onSubmit={handleSubmit(handlePayment)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
                {/* Shipping & Delivery Address Form (7 Cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                        <MapPin className="w-5 h-5 text-[#C48D80]" />
                        <h2 className="font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                            {isAr ? 'عنوان الشحن والتوصيل' : 'Shipping & Delivery Address'}
                        </h2>
                    </div>

                    <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <Label className="text-xs font-semibold text-[#988172]">
                                    {isAr ? 'رقم الهاتف للتواصل' : 'Phone Number'}
                                </Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="tel"
                                        placeholder={isAr ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                                        className="h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm text-[#2B2320] dark:text-[#FAF6F0]"
                                    />
                                </FormControl>
                                <FormMessage className="text-[11px] text-rose-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <Label className="text-xs font-semibold text-[#988172]">
                                    {isAr ? 'المحافظة / المدينة' : 'City / Governorate'}
                                </Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder={isAr ? 'مثال: القاهرة / الجيزة / الإسكندرية' : 'e.g. Cairo / Giza / Alexandria'}
                                        className="h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm text-[#2B2320] dark:text-[#FAF6F0]"
                                    />
                                </FormControl>
                                <FormMessage className="text-[11px] text-rose-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="details"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <Label className="text-xs font-semibold text-[#988172]">
                                    {isAr ? 'تفاصيل العنوان (الشارع، رقم المبنى، الشقة)' : 'Address Details (Street, Building, Apt)'}
                                </Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder={isAr ? 'مثال: شارع التحرير، عمارة 15، شقة 4' : 'e.g. 15 El-Tahrir Street, Apt 4B'}
                                        className="h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm text-[#2B2320] dark:text-[#FAF6F0]"
                                    />
                                </FormControl>
                                <FormMessage className="text-[11px] text-rose-500" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Items & Payment Summary (5 Cols) */}
                <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xl space-y-6">
                    <h3 className="font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0] pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                        {isAr ? 'المنتجات في طلبكِ' : 'Order Items'}
                    </h3>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                        {cartProducts.map((item) => (
                            <CheckoutCard key={item._id} price={item.price} product={item.product} />
                        ))}
                    </div>

                    <Separator className="bg-[#EBDED6] dark:bg-[#3D332E]" />

                    {/* Total Price */}
                    <div className="flex justify-between items-baseline">
                        <span className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                            {isAr ? 'الإجمالي' : 'Total'}
                        </span>
                        <span className="font-serif text-2xl font-bold text-[#C48D80]">
                            {cartTotal} <span className="text-xs font-sans font-normal text-[#988172]">{currencyLabel}</span>
                        </span>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-xs font-semibold text-[#988172] block">
                            {isAr ? 'اختر طريقة الدفع:' : 'Select Payment Method:'}
                        </Label>

                        {/* Cash On Delivery Radio */}
                        <label
                            onClick={() => setIsCash(true)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                isCash
                                    ? 'border-[#C48D80] bg-[#FAF7F2] dark:bg-[#1F1917]'
                                    : 'border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80]/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="payment-method"
                                    checked={isCash}
                                    onChange={() => setIsCash(true)}
                                    className="accent-[#C48D80] w-4 h-4 cursor-pointer"
                                />
                                <div className="flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-[#C48D80]" />
                                    <span className="text-xs sm:text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0]">
                                        {isAr ? 'الدفع نقداً عند الاستلام' : 'Cash On Delivery'}
                                    </span>
                                </div>
                            </div>
                        </label>

                        {/* Online Card Radio */}
                        <label
                            onClick={() => setIsCash(false)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                !isCash
                                    ? 'border-[#C48D80] bg-[#FAF7F2] dark:bg-[#1F1917]'
                                    : 'border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80]/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="payment-method"
                                    checked={!isCash}
                                    onChange={() => setIsCash(false)}
                                    className="accent-[#C48D80] w-4 h-4 cursor-pointer"
                                />
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#C48D80]" />
                                    <span className="text-xs sm:text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0]">
                                        {isAr ? 'بطاقة بنكية / فيزا وماستركارد' : 'Credit / Debit Card (Online)'}
                                    </span>
                                </div>
                            </div>
                            <Image src={Bank} alt="Banks" height={18} className="shrink-0 opacity-80" />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors shadow-md hover:shadow-lg cursor-pointer"
                    >
                        {isSubmitting
                            ? (isAr ? 'جاري تأكيد الطلب...' : 'Processing...')
                            : (isAr ? 'تأكيد وإتمام الطلب الآن' : 'Place Order Now')}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-[#988172] pt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>{isAr ? 'معاملة آمنة ومحمية بتشفير 256-bit' : '256-bit Secure & Encrypted Checkout'}</span>
                    </div>
                </div>
            </form>
        </Form>
    )
}
