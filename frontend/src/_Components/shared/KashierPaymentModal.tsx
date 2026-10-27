'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  Sparkles,
  Zap,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { Input } from '@/_Components/ui/input';
import { Label } from '@/_Components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

export interface KashierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderNumber?: string | number;
  sessionId?: string;
  customerName?: string;
  customerPhone?: string;
  onPaymentSuccess: (sessionId: string) => Promise<void> | void;
}

export default function KashierPaymentModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  sessionId = `ksh_${Date.now()}`,
  customerName = 'عميل رواروسا',
  customerPhone = '01012345678',
  onPaymentSuccess,
}: KashierPaymentModalProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [paymentTab, setPaymentTab] = useState<'card' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName);
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [walletPhone, setWalletPhone] = useState(customerPhone);
  const [walletOtp, setWalletOtp] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  useEffect(() => {
    if (customerName) setCardHolder(customerName);
    if (customerPhone) setWalletPhone(customerPhone);
  }, [customerName, customerPhone]);

  if (!isOpen) return null;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setExpiry(raw);
  };

  // Detect card brand
  const cleanNum = cardNumber.replace(/\s/g, '');
  const isVisa = cleanNum.startsWith('4');
  const isMastercard = cleanNum.startsWith('5');
  const isMeeza = cleanNum.startsWith('5078');

  // Fill Test Card Details (Instant 1-Click for Testing)
  const fillTestCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardHolder(isAr ? 'سارة أحمد (تجريبي)' : 'Sarah Ahmed (Test)');
    setExpiry('12/28');
    setCvv('123');
  };

  // Fill Test Wallet Details
  const fillTestWallet = () => {
    setWalletPhone('01012345678');
    setWalletOtp('123456');
  };

  // Handle Kashier Pay Action
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const ref = `KSH-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionRef(ref);

    try {
      // Step 1: Connecting
      setProcessingStatus(isAr ? 'جاري الاتصال الآمن مع بوابة كاشير (Kashier Gateway)...' : 'Connecting to Kashier Gateway...');
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: 3D Secure / Verification
      setProcessingStatus(isAr ? 'التحقق الآمن من البنك المركزي المصري (3D-Secure)...' : 'Verifying transaction with Central Bank of Egypt (3DS)...');
      await new Promise((r) => setTimeout(r, 1000));

      // Step 3: Success
      setProcessingStatus(isAr ? 'تمت الموافقة على العملية بنجاح! جاري تأكيد الطلب...' : 'Transaction approved! Confirming order...');
      await new Promise((r) => setTimeout(r, 600));

      setIsSuccess(true);
      await onPaymentSuccess(sessionId);
    } catch (err) {
      console.error('Kashier payment error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200'
    >
      <div
        className='relative w-full max-w-lg bg-white dark:bg-[#1E1917] rounded-3xl shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kashier Header */}
        <div className='bg-gradient-to-r from-[#1B2A4A] via-[#1F3A60] to-[#0D1F38] text-white p-5 sm:p-6 relative'>
          <button
            onClick={onClose}
            disabled={isProcessing}
            aria-label='Close'
            className={`absolute top-4 ${
              isRtl ? 'left-4' : 'right-4'
            } size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40`}
          >
            <X className='w-4 h-4' />
          </button>

          <div className='flex items-center gap-3 mb-2'>
            {/* Kashier Logo Stylized Pill */}
            <div className='px-3 py-1 rounded-lg bg-[#00C2A8] text-[#0D1F38] font-black text-xs tracking-wider flex items-center gap-1.5 shadow-sm'>
              <Lock className='w-3 h-3' />
              <span>KASHIER</span>
            </div>
            <span className='px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/40'>
              🧪 {isAr ? 'بيئة الاختبار المجانية • TEST MODE' : 'Free Sandbox • TEST MODE'}
            </span>
          </div>

          <div className='flex items-baseline justify-between mt-3'>
            <div>
              <p className='text-[11px] text-white/70'>
                {isAr ? 'المتجر المعتمد: رواروسا للأزياء الراقية' : 'Merchant: RoaaRosa Luxury Fashion'}
              </p>
              {orderNumber && (
                <p className='text-[11px] text-white/90 font-mono mt-0.5'>
                  {isAr ? 'طلب رقم:' : 'Order Ref:'} #{orderNumber}
                </p>
              )}
            </div>
            <div className='text-right rtl:text-left'>
              <span className='text-[10px] text-white/70 block uppercase tracking-wider'>
                {isAr ? 'المبلغ المطلوب' : 'Total Amount'}
              </span>
              <span className='font-serif text-2xl font-bold text-[#00C2A8]'>
                {amount} <span className='text-xs font-sans font-normal text-white/80'>{isAr ? 'ج.م' : 'EGP'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          /* Success Screen */
          <div className='p-8 text-center space-y-5 animate-in zoom-in-95 duration-300'>
            <div className='w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm'>
              <CheckCircle2 className='w-9 h-9' />
            </div>
            <div className='space-y-1.5'>
              <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'تمت عملية الدفع بنجاح عبر كاشير! 🎉' : 'Payment Completed Successfully! 🎉'}
              </h3>
              <p className='text-xs text-[#988172]'>
                {isAr
                  ? `مرجع العملية: ${transactionRef} • تم تحويل حالة الطلب إلى (قيد التجهيز)`
                  : `Transaction Ref: ${transactionRef} • Order marked as processing`}
              </p>
            </div>
            <div className='p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#5A4F4A] dark:text-[#D1C5BD] space-y-1'>
              <p>{isAr ? 'شكراً لثقتكِ بـ ROAROSA.' : 'Thank you for shopping with ROAROSA.'}</p>
              <p className='text-[11px] text-[#988172]'>{isAr ? 'جاري نقلكِ لصفحة مشترياتكِ...' : 'Redirecting to your orders...'}</p>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing Screen */
          <div className='p-10 text-center space-y-6'>
            <div className='relative w-16 h-16 mx-auto flex items-center justify-center'>
              <Loader2 className='w-14 h-14 text-[#00C2A8] animate-spin' />
              <Lock className='w-5 h-5 text-[#1B2A4A] dark:text-white absolute' />
            </div>
            <div className='space-y-2'>
              <h4 className='font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'جاري معالجة الدفع الآمن...' : 'Processing Secure Payment...'}
              </h4>
              <p className='text-xs text-[#988172] max-w-sm mx-auto leading-relaxed'>
                {processingStatus}
              </p>
            </div>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#28211E] text-[11px] text-[#988172] border border-[#EBDED6] dark:border-[#3D332E]'>
              <ShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
              <span>{isAr ? 'مشفر بتشفير بنكي 256-bit TLS' : '256-bit TLS Bank-Grade Encryption'}</span>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handlePay} className='p-6 space-y-5'>
            {/* Tabs: Card vs Wallet */}
            <div className='grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E]'>
              <button
                type='button'
                onClick={() => setPaymentTab('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'card'
                    ? 'bg-white dark:bg-[#1E1917] text-[#2B2320] dark:text-[#FAF6F0] shadow-xs'
                    : 'text-[#988172] hover:text-[#2B2320]'
                }`}
              >
                <CreditCard className='w-4 h-4 text-[#C48D80]' />
                <span>{isAr ? 'بطاقة بنكية / ميزة' : 'Credit / Debit Card'}</span>
              </button>

              <button
                type='button'
                onClick={() => setPaymentTab('wallet')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'wallet'
                    ? 'bg-white dark:bg-[#1E1917] text-[#2B2320] dark:text-[#FAF6F0] shadow-xs'
                    : 'text-[#988172] hover:text-[#2B2320]'
                }`}
              >
                <Smartphone className='w-4 h-4 text-[#C48D80]' />
                <span>{isAr ? 'محفظة إلكترونية' : 'Mobile Wallet'}</span>
              </button>
            </div>

            {/* Test Mode Helper Banner */}
            <div className='p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 gap-2'>
              <div className='flex items-center gap-2'>
                <Zap className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0' />
                <span className='text-[11px]'>
                  {isAr
                    ? 'تجربة مجانية: يمكنك الضغط على زر التعبئة التلقائية للاختبار الفوري!'
                    : 'Free Test Mode: Click to auto-fill test data instantly!'}
                </span>
              </div>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={paymentTab === 'card' ? fillTestCard : fillTestWallet}
                className='h-7 px-2.5 text-[10px] font-bold rounded-lg border-amber-300 dark:border-amber-700 bg-white dark:bg-[#28211E] text-amber-900 dark:text-amber-200 hover:bg-amber-100 cursor-pointer shrink-0'
              >
                ⚡ {isAr ? 'ملء بيانات الاختبار' : 'Fill Test Info'}
              </Button>
            </div>

            {/* TAB 1: CARD FORM */}
            {paymentTab === 'card' ? (
              <div className='space-y-3.5'>
                <div className='space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                      {isAr ? 'رقم البطاقة (16 رقم)' : 'Card Number'}
                    </Label>
                    <div className='flex items-center gap-1.5 text-[10px] text-[#988172]'>
                      <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${isVisa ? 'bg-blue-600 text-white' : 'opacity-40'}`}>VISA</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${isMastercard ? 'bg-red-500 text-white' : 'opacity-40'}`}>MC</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${isMeeza ? 'bg-emerald-600 text-white' : 'opacity-40'}`}>ميزة</span>
                    </div>
                  </div>
                  <div className='relative'>
                    <Input
                      type='text'
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder='4111 1111 1111 1111'
                      maxLength={19}
                      required
                      className='h-11 rounded-xl font-mono text-sm tracking-wider bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                    />
                    <CreditCard className={`w-4 h-4 absolute top-3.5 ${isRtl ? 'left-3' : 'right-3'} text-[#988172]`} />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                    {isAr ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                  </Label>
                  <Input
                    type='text'
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder='Sarah Ahmed'
                    required
                    className='h-11 rounded-xl text-xs sm:text-sm bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                      {isAr ? 'تاريخ الانتهاء (شهر/سنة)' : 'Expiry Date (MM/YY)'}
                    </Label>
                    <Input
                      type='text'
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder='12/28'
                      maxLength={5}
                      required
                      className='h-11 rounded-xl font-mono text-xs sm:text-sm text-center bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                      CVV / CVC
                    </Label>
                    <Input
                      type='password'
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder='123'
                      maxLength={4}
                      required
                      className='h-11 rounded-xl font-mono text-xs sm:text-sm text-center bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: WALLET FORM */
              <div className='space-y-3.5'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                    {isAr ? 'رقم محفظة المحمول (فودافون كاش، اتصالات، أورنج، وي)' : 'Mobile Wallet Number (Vodafone, Orange, Etisalat, WE)'}
                  </Label>
                  <Input
                    type='tel'
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder='01012345678'
                    required
                    className='h-11 rounded-xl text-xs sm:text-sm bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold text-[#5A4F4A] dark:text-[#D1C5BD]'>
                    {isAr ? 'رمز التأكيد OTP (محاكاة)' : 'OTP Code (Test Mode)'}
                  </Label>
                  <Input
                    type='text'
                    value={walletOtp}
                    onChange={(e) => setWalletOtp(e.target.value)}
                    placeholder='123456'
                    maxLength={6}
                    required
                    className='h-11 rounded-xl font-mono text-center tracking-widest text-sm bg-[#FAF7F2] dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                  />
                  <p className='text-[10px] text-[#988172]'>
                    {isAr ? 'في وضع التجربة يتم قبول كود 123456 مباشرة' : 'In test mode, enter 123456'}
                  </p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <Button
              type='submit'
              className='w-full h-12 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009688] hover:from-[#00B29A] hover:to-[#00897B] text-[#0D1F38] font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2'
            >
              <Lock className='w-4 h-4' />
              <span>
                {isAr
                  ? `دفع ${amount} ج.م عبر كاشير (وضع تجريبي)`
                  : `Pay ${amount} EGP via Kashier (Test)`}
              </span>
            </Button>

            {/* CBE & PCI DSS Badge */}
            <div className='flex items-center justify-center gap-3 pt-2 text-[10px] text-[#988172] border-t border-[#EBDED6] dark:border-[#3D332E]'>
              <span className='flex items-center gap-1'>
                <ShieldCheck className='w-3.5 h-3.5 text-emerald-600' />
                <span>PCI-DSS Level 1</span>
              </span>
              <span>•</span>
              <span>{isAr ? 'مرخص من البنك المركزي المصري' : 'CBE Licensed'}</span>
              <span>•</span>
              <span>Kashier Sandbox</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
