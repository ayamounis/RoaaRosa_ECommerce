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
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { CreateCashOrder, CreateOnlineOrder, verifyOnlinePayment } from "./payment.actions"
import { paymentSchema } from "./payment.schema"
import { paymentTypes } from "./payment.types"
import { useLanguage } from "@/context/LanguageContext"
import { CreditCard, Banknote, ShieldCheck, MapPin, Sparkles, CheckCircle2, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import KashierPaymentModal from "@/_Components/shared/KashierPaymentModal"
import Link from "next/link"

export default function PaymentForm() {
    const { language, isRtl } = useLanguage()
    const isAr = language === 'ar'
    const currencyLabel = isAr ? 'ج.م' : 'EGP'

    const [cartId, setCartId] = useState<string | null>(null)
    const [cartProducts, setCartProducts] = useState<IProductCart[]>([])
    const { _id, city, details, phone } = useSelector((state: RootState) => state.address)
    const [cartTotal, setCartTotal] = useState<number>(0)
    const [paymentMethod, setPaymentMethod] = useState<'kashier' | 'cash'>('kashier')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Kashier Modal state
    const [isKashierModalOpen, setIsKashierModalOpen] = useState(false)
    const [kashierSessionId, setKashierSessionId] = useState('')
    const [kashierOrderNumber, setKashierOrderNumber] = useState<string | number>('')

    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const RhfObj = useForm<paymentTypes>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            city: '',
            phone: '',
            details: '',
        }
    })
    const { control, handleSubmit, setValue, getValues } = RhfObj

    async function handlePayment(values: paymentTypes) {
        if (!cartId) {
            toast.error(isAr ? 'حقيبة التسوق فارغة أو غير متوفرة' : 'Cart is empty or unavailable')
            return
        }

        setIsSubmitting(true)
        try {
            if (paymentMethod === 'cash') {
                const res = await CreateCashOrder(cartId, values)
                if (res?.status === 'success' || res?.data) {
                    toast.success(isAr ? 'تم تأكيد طلبكِ بنجاح! شكراً لتسوقكِ معنا' : 'Order Placed Successfully!')
                    dispatch(updateCartCountAsync())
                    router.push('/allorders')
                } else {
                    toast.error(res?.message || (isAr ? 'تعذر إنشاء الطلب، يرجى المحاولة لاحقاً' : 'Failed to Create Order'))
                }
            } else {
                // Online Kashier Payment Gateway
                const res = await CreateOnlineOrder(cartId, values)
                if (res?.status === 'success' && res?.session) {
                    setKashierSessionId(res.session.id)
                    setKashierOrderNumber(res.session.orderNumber || '')
                    setIsKashierModalOpen(true)
                } else {
                    toast.error(res?.message || (isAr ? 'تعذر الاتصال ببوابة كاشير، يرجى المحاولة لاحقاً' : 'Failed to connect to Kashier gateway'))
                }
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.error(isAr ? 'حدث خطأ أثناء معالجة الطلب' : 'An error occurred during order processing')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Called when customer confirms payment inside Kashier modal
    const handleKashierPaymentSuccess = async (sessionId: string) => {
        try {
            await verifyOnlinePayment(sessionId)
            dispatch(updateCartCountAsync())
            toast.success(isAr ? 'تم تأكيد وسداد الطلب بنجاح عبر كاشير! 🎉' : 'Payment verified and order confirmed! 🎉')
            setIsKashierModalOpen(false)
            router.push(`/allorders?session_id=${sessionId}&paid=true`)
        } catch (err) {
            console.error('Verify payment error:', err)
            router.push('/allorders')
        }
    }

    async function getUserCartInfo() {
        const res = await getUserCart()
        if (res?.status === 'success') {
            setCartId(res.cartId)
            setCartProducts(res.data.products || [])
            setCartTotal(res.data.totalCartPrice || 0)
        }
    }

    useEffect(() => {
        getUserCartInfo()
    }, [])

    useEffect(() => {
        if (_id) {
            setValue('city', city || '')
            setValue('phone', phone || '')
            setValue('details', details || '')
        }
    }, [_id, city, details, phone, setValue])

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-8">
            {/* 3-Step Checkout Stepper */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {/* Step 1: Cart */}
                    <Link
                        href="/cart"
                        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl text-[#988172] hover:text-[#C48D80] transition-colors"
                    >
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center text-[11px] font-bold">
                            ✓
                        </span>
                        <span className="font-semibold">{isAr ? '١. حقيبة التسوق' : '1. Shopping Bag'}</span>
                    </Link>

                    {/* Step 2: Checkout (Active) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[#2B2320] dark:text-[#FAF6F0]">
                        <span className="w-6 h-6 rounded-full bg-[#C48D80] text-white flex items-center justify-center text-[11px] font-bold">
                            ٢
                        </span>
                        <span className="font-bold">{isAr ? '٢. تفاصيل الشحن والطلب' : '2. Shipping & Order'}</span>
                    </div>

                    {/* Step 3: Kashier Payment */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-2xl text-[#988172]">
                        <span className="w-6 h-6 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] flex items-center justify-center text-[11px] font-bold border border-[#EBDED6] dark:border-[#3D332E]">
                            ٣
                        </span>
                        <span className="font-medium">{isAr ? '٣. بوابة الدفع كاشير' : '3. Kashier Payment'}</span>
                    </div>
                </div>
            </div>

            <Form {...RhfObj}>
                <form
                    onSubmit={handleSubmit(handlePayment)}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                    {/* Shipping & Delivery Address Form (7 Cols) */}
                    <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#C48D80]" />
                                <h2 className="font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                                    {isAr ? 'عنوان الشحن والتوصيل' : 'Shipping & Delivery Address'}
                                </h2>
                            </div>
                            <span className="text-[11px] text-[#988172]">
                                {isAr ? 'توصيل سريع لكافة محافظات مصر' : 'Fast delivery across Egypt'}
                            </span>
                        </div>

                        <FormField
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-[#988172]">
                                        {isAr ? 'رقم الهاتف للتواصل (موبايل مصري)' : 'Phone Number (Egyptian Mobile)'}
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
                                            placeholder={isAr ? 'مثال: القاهرة / الجيزة / الإسكندرية / المنصورة' : 'e.g. Cairo / Giza / Alexandria'}
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
                                        {isAr ? 'تفاصيل العنوان (الشارع، رقم العمارة، رقم الشقة)' : 'Address Details (Street, Building, Apt)'}
                                    </Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder={isAr ? 'مثال: 15 شارع النيل، الدور الرابع، شقة 8' : 'e.g. 15 Nile St, 4th Floor, Apt 8'}
                                            className="h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border-[#EBDED6] dark:border-[#3D332E] text-xs sm:text-sm text-[#2B2320] dark:text-[#FAF6F0]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px] text-rose-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Order Summary & Payment Gateway Selector (5 Cols) */}
                    <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xl space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                            <h3 className="font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                                {isAr ? 'ملخص الطلب' : 'Order Summary'}
                            </h3>
                            <span className="text-xs font-semibold text-[#C48D80]">
                                {cartProducts.length} {isAr ? 'قطع' : 'items'}
                            </span>
                        </div>

                        {/* Items Preview */}
                        <div className="space-y-3 max-h-52 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                            {cartProducts.map((item) => (
                                <CheckoutCard key={item._id} price={item.price} product={item.product} />
                            ))}
                        </div>

                        <Separator className="bg-[#EBDED6] dark:bg-[#3D332E]" />

                        {/* Total Price */}
                        <div className="flex justify-between items-baseline">
                            <span className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                                {isAr ? 'إجمالي الطلب' : 'Total Amount'}
                            </span>
                            <span className="font-serif text-3xl font-bold text-[#C48D80]">
                                {cartTotal} <span className="text-xs font-sans font-normal text-[#988172]">{currencyLabel}</span>
                            </span>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="space-y-3 pt-2">
                            <Label className="text-xs font-semibold text-[#988172] block">
                                {isAr ? 'طريقة الدفع:' : 'Select Payment Method:'}
                            </Label>

                            {/* 1. KASHIER PAYMENT GATEWAY (Recommended / Test Mode) */}
                            <label
                                onClick={() => setPaymentMethod('kashier')}
                                className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                                    paymentMethod === 'kashier'
                                        ? 'border-[#00C2A8] bg-[#00C2A8]/5 dark:bg-[#00C2A8]/10 ring-1 ring-[#00C2A8]'
                                        : 'border-[#EBDED6] dark:border-[#3D332E] hover:border-[#00C2A8]/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            checked={paymentMethod === 'kashier'}
                                            onChange={() => setPaymentMethod('kashier')}
                                            className="accent-[#00C2A8] w-4 h-4 cursor-pointer"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-md bg-[#00C2A8] text-[#0D1F38] text-[10px] font-black tracking-wider">
                                                KASHIER
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                                                {isAr ? 'بوابة كاشير للدفع الإلكتروني' : 'Kashier Payment Gateway'}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-400/40">
                                        🧪 {isAr ? 'تجربة مجانية' : 'Free Test'}
                                    </span>
                                </div>

                                <div className="text-[11px] text-[#988172] pr-7 rtl:pr-7 rtl:pl-0 pl-7 space-y-1">
                                    <p>
                                        {isAr
                                            ? 'ادفعي بأمان ببطاقات فيزا، ماستركارد، ميزة، أو المحافظ الإلكترونية (فودافون كاش، اتصالات، أورنج، وي).'
                                            : 'Pay securely with Visa, MasterCard, Meeza, or Egyptian Mobile Wallets.'}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-[#5A4F4A] dark:text-[#D1C5BD]">
                                        <span className="bg-[#FAF7F2] dark:bg-[#1F1917] px-1.5 py-0.5 rounded border border-[#EBDED6] dark:border-[#3D332E]">VISA</span>
                                        <span className="bg-[#FAF7F2] dark:bg-[#1F1917] px-1.5 py-0.5 rounded border border-[#EBDED6] dark:border-[#3D332E]">MasterCard</span>
                                        <span className="bg-[#FAF7F2] dark:bg-[#1F1917] px-1.5 py-0.5 rounded border border-[#EBDED6] dark:border-[#3D332E]">ميزة Meeza</span>
                                        <span className="bg-[#FAF7F2] dark:bg-[#1F1917] px-1.5 py-0.5 rounded border border-[#EBDED6] dark:border-[#3D332E]">Vodafone Cash</span>
                                    </div>
                                </div>
                            </label>

                            {/* 2. CASH ON DELIVERY */}
                            <label
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                    paymentMethod === 'cash'
                                        ? 'border-[#C48D80] bg-[#FAF7F2] dark:bg-[#1F1917] ring-1 ring-[#C48D80]'
                                        : 'border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80]/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="accent-[#C48D80] w-4 h-4 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Banknote className="w-4 h-4 text-[#C48D80]" />
                                        <span className="text-xs sm:text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0]">
                                            {isAr ? 'الدفع نقداً عند الاستلام' : 'Cash On Delivery'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[11px] text-[#988172]">
                                    {isAr ? 'عند وصول مندوب الشحن' : 'Pay at doorstep'}
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || cartProducts.length === 0}
                            className={`w-full h-12 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                                paymentMethod === 'kashier'
                                    ? 'bg-gradient-to-r from-[#00C2A8] to-[#009688] hover:from-[#00B29A] hover:to-[#00897B] text-[#0D1F38] font-bold'
                                    : 'bg-[#C48D80] hover:bg-[#B27B6E] text-white'
                            }`}
                        >
                            {isSubmitting ? (
                                <span>{isAr ? 'جاري الاتصال والتحويل...' : 'Connecting...'}</span>
                            ) : paymentMethod === 'kashier' ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>{isAr ? 'المتابعة إلى بوابة الدفع كاشير (مجاناً)' : 'Proceed to Kashier Payment (Test)'}</span>
                                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{isAr ? 'تأكيد طلب الدفع عند الاستلام' : 'Confirm Cash on Delivery'}</span>
                                </>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-[#988172] pt-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>{isAr ? 'بياناتكِ مشفرة ومحمية بالكامل بتشفير SSL 256-bit' : '256-bit Secure & Encrypted Checkout'}</span>
                        </div>
                    </div>
                </form>
            </Form>

            {/* Kashier Test Payment Gateway Modal */}
            <KashierPaymentModal
                isOpen={isKashierModalOpen}
                onClose={() => setIsKashierModalOpen(false)}
                amount={cartTotal}
                orderNumber={kashierOrderNumber}
                sessionId={kashierSessionId}
                customerName={getValues('details') || 'عميلة رواروسا'}
                customerPhone={getValues('phone') || '01012345678'}
                onPaymentSuccess={handleKashierPaymentSuccess}
            />
        </div>
    )
}
