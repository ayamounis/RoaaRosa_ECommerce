'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import { Button } from '@/_Components/ui/button';
import { createContactSchema, ContactFormData } from './contact.schema';

interface ContactSectionProps {
  embedded?: boolean;
}

export default function ContactSection({ embedded = false }: ContactSectionProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactSchema(isAr)),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const currentSubject = watch('subject');
  const currentMessage = watch('message') || '';

  React.useEffect(() => {
    register('subject');
  }, [register]);

  const quickSubjects = [
    {
      label: isAr ? 'استفسار عن مقاسات البنات' : 'Girls Sizing Inquiry',
      val: isAr ? 'استفسار عن مقاسات البنات' : 'Girls Sizing Inquiry',
    },
    {
      label: isAr ? 'أزياء المناسبات الخاصة' : 'Occasionwear & Party',
      val: isAr ? 'أزياء المناسبات الخاصة' : 'Occasionwear & Party',
    },
    {
      label: isAr ? 'متابعة وتوصيل الطلب' : 'Delivery & Order Status',
      val: isAr ? 'متابعة وتوصيل الطلب' : 'Delivery & Order Status',
    },
    {
      label: isAr ? 'استفسار عام أو اقتراح' : 'General Inquiry / Feedback',
      val: isAr ? 'استفسار عام أو اقتراح' : 'General Inquiry / Feedback',
    },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          subject: data.subject.trim(),
          message: data.message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send contact message');
      }

      setIsSuccess(true);
      toast.success(
        isAr
          ? 'تم إرسال رسالتك بنجاح! سيقوم فريق خدمة العملاء بالرد عليك قريباً.'
          : 'Your inquiry has been received! Our concierge team will reach out shortly.'
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        isAr
          ? 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while sending your message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    reset();
    setIsSuccess(false);
  };

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative w-full ${embedded ? 'py-12 sm:py-16' : 'py-8 sm:py-12'}`}
    >
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C48D80]/15 text-[#C48D80] text-xs font-semibold'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>{isAr ? 'صندوق التواصل وخدمة عملاء رواروسا' : 'ROAROSA Concierge & Client Care'}</span>
          </div>
          <h2 className='font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'يسعدنا دائماً الاستماع إليكِ' : 'We’d Love to Hear from You'}
          </h2>
          <p className='text-xs sm:text-sm text-[#988172] leading-relaxed'>
            {isAr
              ? 'سواء كنتِ تبحثين عن المقاس المثالي لابنتك، ترغبين في تفصيل فستان لمناسبة عائلية راقية، أو لديك أي اقتراح، فريقنا مستعد لمساعدتك بكل محبة واهتمام.'
              : 'Whether you need sizing advice for your little girl, guidance on delicate occasionwear, or have general feedback, our dedicated concierge team is at your service.'}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
          {/* Column 1: Contact Details & Boutiques (5 cols) */}
          <div className='lg:col-span-5 space-y-6'>
            {/* Boutiques & Locations Card */}
            <div className='p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-6'>
              <div>
                <span className='text-[10px] uppercase tracking-widest font-semibold text-[#C48D80] block mb-1'>
                  {isAr ? 'فروعنا وبوتيكاتنا' : 'Our Flagship Boutiques'}
                </span>
                <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {isAr ? 'مصر • القاهرة' : 'Cairo, Egypt'}
                </h3>
              </div>

              {/* Boutique 1 */}
              <div className='flex items-start gap-3.5 pb-4 border-b border-[#EBDED6]/60 dark:border-[#3D332E]/60'>
                <div className='w-10 h-10 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80] shrink-0'>
                  <MapPin className='w-4 h-4' />
                </div>
                <div className='space-y-1 text-xs'>
                  <div className='font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                    {isAr ? 'بوتيك الزمالك' : 'Zamalek Boutique'}
                  </div>
                  <p className='text-[#988172] leading-relaxed'>
                    {isAr ? 'شارع 26 يوليو، الزمالك، القاهرة' : '26th of July St, Zamalek, Cairo'}
                  </p>
                </div>
              </div>

              {/* Boutique 2 */}
              <div className='flex items-start gap-3.5 pb-4 border-b border-[#EBDED6]/60 dark:border-[#3D332E]/60'>
                <div className='w-10 h-10 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center text-[#C48D80] shrink-0'>
                  <MapPin className='w-4 h-4' />
                </div>
                <div className='space-y-1 text-xs'>
                  <div className='font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                    {isAr ? 'فرع القاهرة الجديدة' : 'New Cairo Boutique'}
                  </div>
                  <p className='text-[#988172] leading-relaxed'>
                    {isAr ? 'التجمع الخامس، القاهرة الجديدة' : '5th Settlement, New Cairo, Egypt'}
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className='space-y-3 pt-1 text-xs'>
                <div className='flex items-center gap-3 text-[#2B2320] dark:text-[#FAF6F0]'>
                  <Phone className='w-4 h-4 text-[#C48D80] shrink-0' />
                  <span className='font-mono font-medium' dir='ltr'>+20 (0) 120 728 6573</span>
                </div>
                <div className='flex items-center gap-3 text-[#2B2320] dark:text-[#FAF6F0]'>
                  <Mail className='w-4 h-4 text-[#C48D80] shrink-0' />
                  <span className='font-medium'>care@roarosa.com</span>
                </div>
                <div className='flex items-center gap-3 text-[#988172]'>
                  <Clock className='w-4 h-4 text-[#C48D80] shrink-0' />
                  <span>
                    {isAr ? 'يومياً: 10:00 صباحاً - 10:00 مساءً (بتوقيت القاهرة)' : 'Daily: 10:00 AM – 10:00 PM CLT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reassurance Value Props */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
              <div className='p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#28211E]/70 border border-[#EBDED6] dark:border-[#3D332E] space-y-1.5'>
                <div className='flex items-center gap-2 text-[#C48D80]'>
                  <ShieldCheck className='w-4 h-4' />
                  <span className='text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                    {isAr ? 'رد خلال 24 ساعة' : '24h Response'}
                  </span>
                </div>
                <p className='text-[11px] text-[#988172] leading-normal'>
                  {isAr
                    ? 'يتم تحويل كل رسالة مباشرة إلى صندوق إدارة رواروسا لمتابعتها فوراً.'
                    : 'Every submission is routed straight into our admin desk for priority reply.'}
                </p>
              </div>

              <div className='p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#28211E]/70 border border-[#EBDED6] dark:border-[#3D332E] space-y-1.5'>
                <div className='flex items-center gap-2 text-[#C48D80]'>
                  <HeartHandshake className='w-4 h-4' />
                  <span className='text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                    {isAr ? 'استشارات مقاسات مجانية' : 'Free Sizing Advice'}
                  </span>
                </div>
                <p className='text-[11px] text-[#988172] leading-normal'>
                  {isAr
                    ? 'خبراء متخصصون لمساعدتكِ في اختيار فستان مناسب لبشرة وطول بنوتك.'
                    : 'Styling experts ready to help pick the gentlest fit for your child.'}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: The Contact Form with Zod + RHF (7 cols) */}
          <div className='lg:col-span-7'>
            <div className='p-6 sm:p-9 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm'>
              {isSuccess ? (
                <div className='py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300'>
                  <div className='w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20'>
                    <CheckCircle2 className='w-10 h-10' />
                  </div>
                  <div className='space-y-2 max-w-md mx-auto'>
                    <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                      {isAr ? 'شكراً لتواصلكِ معنا، تم استلام رسالتك!' : 'Thank You! Message Received'}
                    </h3>
                    <p className='text-xs sm:text-sm text-[#988172] leading-relaxed'>
                      {isAr
                        ? 'تم تسجيل استفساركِ بنجاح في صندوق بريد إدارة رواروسا، وسيتواصل معكِ فريق خدمة العملاء عبر بريدكِ الإلكتروني في أقرب وقت.'
                        : 'Your inquiry has been successfully delivered to our admin mailbox. Our team will review and reply to your email shortly.'}
                    </p>
                  </div>
                  <div className='pt-2'>
                    <Button
                      onClick={handleSendAnother}
                      variant='outline'
                      className='h-11 px-7 rounded-full border-[#EBDED6] dark:border-[#3D332E] text-xs font-semibold'
                    >
                      {isAr ? 'إرسال رسالة أخرى' : 'Send Another Inquiry'}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-5'>
                  <div>
                    <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                      {isAr ? 'نموذج التواصل المباشر' : 'Send Us a Message'}
                    </h3>
                    <p className='text-xs text-[#988172] mt-1'>
                      {isAr
                        ? 'املأي الحقول التالية وسنكون سعداء بالإجابة على كل استفساراتكِ'
                        : 'Fill out the details below and we will gladly answer all your queries'}
                    </p>
                  </div>

                  {/* Name & Phone */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Full Name */}
                    <div className='space-y-1.5'>
                      <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                        <User className='w-3.5 h-3.5 text-[#C48D80]' />
                        <span>{isAr ? 'الاسم الكامل' : 'Full Name'}</span>
                        <span className='text-rose-500'>*</span>
                      </label>
                      <input
                        type='text'
                        {...register('name')}
                        placeholder={isAr ? 'مثال: سارة الشريف' : 'e.g. Sarah Sherif'}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C48D80] ${
                          errors.name
                            ? 'border-rose-500 dark:border-rose-500/80'
                            : 'border-[#EBDED6] dark:border-[#3D332E]'
                        }`}
                      />
                      {errors.name && (
                        <p className='text-[11px] text-rose-500 flex items-center gap-1 font-medium pt-0.5'>
                          <AlertCircle className='w-3 h-3 shrink-0' />
                          <span>{errors.name.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className='space-y-1.5'>
                      <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                        <Phone className='w-3.5 h-3.5 text-[#C48D80]' />
                        <span>{isAr ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'}</span>
                      </label>
                      <input
                        type='tel'
                        dir='ltr'
                        {...register('phone')}
                        placeholder='+20 120 728 6573'
                        className={`w-full px-4 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C48D80] ${
                          errors.phone
                            ? 'border-rose-500 dark:border-rose-500/80'
                            : 'border-[#EBDED6] dark:border-[#3D332E]'
                        }`}
                      />
                      {errors.phone && (
                        <p className='text-[11px] text-rose-500 flex items-center gap-1 font-medium pt-0.5'>
                          <AlertCircle className='w-3 h-3 shrink-0' />
                          <span>{errors.phone.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className='space-y-1.5'>
                    <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                      <Mail className='w-3.5 h-3.5 text-[#C48D80]' />
                      <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                      <span className='text-rose-500'>*</span>
                    </label>
                    <input
                      type='email'
                      dir='ltr'
                      {...register('email')}
                      placeholder='sarah@example.com'
                      className={`w-full px-4 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C48D80] ${
                        errors.email
                          ? 'border-rose-500 dark:border-rose-500/80'
                          : 'border-[#EBDED6] dark:border-[#3D332E]'
                      }`}
                    />
                    {errors.email && (
                      <p className='text-[11px] text-rose-500 flex items-center gap-1 font-medium pt-0.5'>
                        <AlertCircle className='w-3 h-3 shrink-0' />
                        <span>{errors.email.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject with Quick Tags */}
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                      <MessageSquare className='w-3.5 h-3.5 text-[#C48D80]' />
                      <span>{isAr ? 'موضوع الرسالة' : 'Subject'}</span>
                      <span className='text-rose-500'>*</span>
                    </label>

                    {/* Quick Pick Pills */}
                    <div className='flex flex-wrap gap-2 pt-0.5'>
                      {quickSubjects.map((q, idx) => {
                        const isSelected = currentSubject === q.val;
                        return (
                          <button
                            key={idx}
                            type='button'
                            onClick={() => setValue('subject', q.val, { shouldValidate: true })}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#C48D80] text-white shadow-xs'
                                : 'bg-[#FAF9F5] dark:bg-[#1F1917] text-[#988172] hover:text-[#2B2320] dark:hover:text-white border border-[#EBDED6] dark:border-[#3D332E]'
                            }`}
                          >
                            {q.label}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type='text'
                      name='subject'
                      value={currentSubject || ''}
                      onChange={(e) => setValue('subject', e.target.value, { shouldValidate: true })}
                      placeholder={
                        isAr ? 'أو اكتبي موضوعاً مخصصاً هنا...' : 'Or type a custom subject here...'
                      }
                      className={`w-full px-4 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C48D80] ${
                        errors.subject
                          ? 'border-rose-500 dark:border-rose-500/80'
                          : 'border-[#EBDED6] dark:border-[#3D332E]'
                      }`}
                    />
                    {errors.subject && (
                      <p className='text-[11px] text-rose-500 flex items-center gap-1 font-medium pt-0.5'>
                        <AlertCircle className='w-3 h-3 shrink-0' />
                        <span>{errors.subject.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1'>
                        <span>{isAr ? 'نص الرسالة أو الاستفسار' : 'Your Message'}</span>
                        <span className='text-rose-500'>*</span>
                      </label>
                      <span className='text-[10px] text-[#988172] font-mono'>
                        {currentMessage.length} / 3000
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      {...register('message')}
                      placeholder={
                        isAr
                          ? 'تفاصيل استفساركِ عن المقاسات، الأقمشة، المناسبات، أو أرقام الطلبات...'
                          : 'Please share details regarding your order, dress sizing, or questions...'
                      }
                      className={`w-full px-4 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C48D80] resize-y ${
                        errors.message
                          ? 'border-rose-500 dark:border-rose-500/80'
                          : 'border-[#EBDED6] dark:border-[#3D332E]'
                      }`}
                    />
                    {errors.message && (
                      <p className='text-[11px] text-rose-500 flex items-center gap-1 font-medium pt-0.5'>
                        <AlertCircle className='w-3 h-3 shrink-0' />
                        <span>{errors.message.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className='pt-2'>
                    <Button
                      type='submit'
                      disabled={submitting}
                      className='w-full sm:w-auto min-w-[200px] h-12 px-8 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60'
                    >
                      {submitting ? (
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <>
                          <Send className='w-4 h-4' />
                          <span>{isAr ? 'إرسال الرسالة إلى الإدارة' : 'Send Message to Concierge'}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
