'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Phone,
  MessageCircle,
  Package,
  FileText,
  Send,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Store,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import { Button } from '@/_Components/ui/button';
import { createQuickInquirySchema, QuickInquiryFormData } from './contact.schema';

const STORE_WHATSAPP_NUMBER = '201207286573';
const STORE_PHONE_DISPLAY = '+20 120 728 6573';

const PIECES_PRESETS = [
  { id: '1', labelAr: 'قطعة واحدة (1)', labelEn: '1 Piece' },
  { id: '2-5', labelAr: '2 - 5 قطع', labelEn: '2 - 5 Pieces' },
  { id: '6-15', labelAr: '6 - 15 قطعة', labelEn: '6 - 15 Pieces' },
  { id: '16-50', labelAr: '16 - 50 قطعة', labelEn: '16 - 50 Pieces' },
  { id: '50+', labelAr: 'أكثر من 50 (جملة)', labelEn: '50+ (Wholesale)' },
  { id: 'custom', labelAr: 'تحديد عدد مخصص...', labelEn: 'Custom...' },
];

interface ContactSectionProps {
  embedded?: boolean;
}

export default function ContactSection({ embedded = false }: ContactSectionProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [selectedPieceOption, setSelectedPieceOption] = useState<string>('1');
  const [customPieceCount, setCustomPieceCount] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<QuickInquiryFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuickInquiryFormData>({
    resolver: zodResolver(createQuickInquirySchema(isAr)),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      whatsapp: '',
      pieces: 'قطعة واحدة (1)',
      notes: '',
    },
  });

  const currentPhone = watch('phone');

  const handlePieceSelect = (presetId: string, label: string) => {
    setSelectedPieceOption(presetId);
    if (presetId === 'custom') {
      const val = customPieceCount ? `${customPieceCount} قطعة` : '';
      setValue('pieces', val, { shouldValidate: Boolean(val) });
    } else {
      setValue('pieces', label, { shouldValidate: true });
    }
  };

  const handleCustomCountChange = (val: string) => {
    setCustomPieceCount(val);
    if (val.trim()) {
      setValue('pieces', `${val} قطعة`, { shouldValidate: true });
    } else {
      setValue('pieces', '', { shouldValidate: true });
    }
  };

  const handleCopyPhoneToWhatsapp = () => {
    if (currentPhone) {
      setValue('whatsapp', currentPhone, { shouldValidate: true });
      toast.success(isAr ? 'تم نسخ رقم الهاتف لحقل الواتساب' : 'Phone copied to WhatsApp field');
    }
  };

  const onSubmit = async (data: QuickInquiryFormData) => {
    setSubmitting(true);
    try {
      const cleanPhone = data.phone.replace(/[^\d+]/g, '');
      const subject = isAr
        ? `استفسار جديد: ${data.pieces} - ${data.name}`
        : `New Inquiry: ${data.pieces} - ${data.name}`;

      const messageContent = `
اسم العميل: ${data.name}
رقم الهاتف: ${data.phone}
رقم الواتساب: ${data.whatsapp}
عدد القطع المطلوبة: ${data.pieces}

الملحوظات والتفاصيل:
${data.notes?.trim() || (isAr ? 'لا توجد ملحوظات إضافية' : 'No additional notes provided.')}
      `.trim();

      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: `${cleanPhone || Date.now()}@inquiry.roarosa.com`,
          phone: data.phone.trim(),
          subject,
          message: messageContent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send contact inquiry');
      }

      setSubmittedData(data);
      setIsSuccess(true);
      toast.success(
        isAr
          ? 'تم إرسال استفساركِ بنجاح! سيتواصل معكِ فريقنا قريباً.'
          : 'Your inquiry has been received! We will be in touch shortly.'
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        isAr
          ? 'عذراً، حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى أو مراسلتنا واتساب مباشرة.'
          : 'Could not send inquiry. Please try again or reach out on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppChatUrl = (data: QuickInquiryFormData | null) => {
    if (!data) return `https://wa.me/${STORE_WHATSAPP_NUMBER}`;
    const text = isAr
      ? `مرحباً رواروسا، أنا ${data.name}. أرغب بالاستفسار عن طلب (${data.pieces}).\nرقم الهاتف: ${data.phone}\n${data.notes ? `ملحوظاتي: ${data.notes}` : ''}`
      : `Hello ROAROSA, I'm ${data.name}. I'd like to inquire about an order of (${data.pieces}).\nPhone: ${data.phone}\n${data.notes ? `Notes: ${data.notes}` : ''}`;
    return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text.trim())}`;
  };

  return (
    <section className={embedded ? "py-4 sm:py-8 px-4 sm:px-6" : "py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"}>
      <div className="max-w-3xl mx-auto">
        {/* Serene, Minimal Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-[11px] font-medium text-[#C48D80]">
            <Sparkles className="w-3 h-3" />
            <span>{isAr ? 'تواصل وطلب استفسار' : 'Contact & Custom Inquiry'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] tracking-tight">
            {isAr ? 'نسعد دائماً بتواصلكِ معنا' : 'We Would Love to Hear From You'}
          </h1>

          <p className="text-xs sm:text-sm text-[#988172] max-w-lg mx-auto leading-relaxed">
            {isAr
              ? 'سجّلي بياناتكِ وعدد القطع التي ترغبين بها، وسيقوم فريقنا بالتواصل معكِ فوراً لتأكيد الموديل والمقاسات.'
              : 'Share your details and desired number of pieces. Our stylists will reach out shortly to assist with sizes and delivery.'}
          </p>

          {/* Quick Direct WhatsApp Pill */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-[#988172]">
            <span>{isAr ? 'أو عبر الواتساب المباشر:' : 'Or chat instantly via WhatsApp:'}</span>
            <a
              href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono font-semibold text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-4"
              dir="ltr"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{STORE_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-sm p-6 sm:p-10 transition-all">
          {isSuccess && submittedData ? (
            /* Success State */
            <div className="py-8 sm:py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                  {isAr ? 'تم استلام استفساركِ بنجاح' : 'Inquiry Received with Pleasure'}
                </h3>
                <p className="text-xs text-[#988172] max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? `شكراً لكِ يا ${submittedData.name}. تم تسجيل طلبكِ لـ (${submittedData.pieces})، وسيتواصل معكِ مستشار رواروسا قريباً على رقمكِ.`
                    : `Thank you, ${submittedData.name}. We noted your inquiry for (${submittedData.pieces}). Our stylist will contact you shortly.`}
                </p>
              </div>

              {/* Inquiry Recap Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-start space-y-2">
                <div className="flex justify-between py-1 border-b border-[#EBDED6]/60 dark:border-[#3D332E]/60 text-[#988172]">
                  <span>{isAr ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-semibold text-[#2B2320] dark:text-[#FAF6F0]">{submittedData.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EBDED6]/60 dark:border-[#3D332E]/60 text-[#988172]">
                  <span>{isAr ? 'الواتساب:' : 'WhatsApp:'}</span>
                  <span className="font-mono font-semibold text-[#2B2320] dark:text-[#FAF6F0]" dir="ltr">{submittedData.whatsapp}</span>
                </div>
                <div className="flex justify-between py-1 text-[#988172]">
                  <span>{isAr ? 'عدد القطع:' : 'Pieces:'}</span>
                  <span className="font-bold text-[#C48D80]">{submittedData.pieces}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href={generateWhatsAppChatUrl(submittedData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'متابعة المحادثة عبر الواتساب الآن' : 'Continue on WhatsApp Now'}</span>
                </a>

                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setSelectedPieceOption('1');
                    setCustomPieceCount('');
                    setIsSuccess(false);
                    setSubmittedData(null);
                  }}
                  className="w-full sm:w-auto rounded-2xl border-[#EBDED6] text-xs py-3 px-6"
                >
                  <span>{isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}</span>
                </Button>
              </div>
            </div>
          ) : (
            /* Calm 5-Field Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
                  {isAr ? 'الاسم الكريم *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    {...register('name')}
                    placeholder={isAr ? 'مثال: سارة محمد' : 'e.g. Sarah Sherif'}
                    className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs bg-[#FAF9F5] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden transition-colors ${
                      errors.name
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-[#EBDED6] dark:border-[#3D332E] focus:border-[#C48D80]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Field 2 & Field 3: Phone and WhatsApp (Side by side on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
                    {isAr ? 'رقم الهاتف *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder={isAr ? '01012345678' : '+20 10 1234 5678'}
                      className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs bg-[#FAF9F5] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden transition-colors ${
                        errors.phone
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-[#EBDED6] dark:border-[#3D332E] focus:border-[#C48D80]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                      {isAr ? 'رقم الواتساب *' : 'WhatsApp Number *'}
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyPhoneToWhatsapp}
                      className="text-[10px] text-[#C48D80] hover:text-[#B27B6E] inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{isAr ? 'نفس رقم الهاتف' : 'Same as phone'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      {...register('whatsapp')}
                      placeholder={isAr ? '01012345678' : '+20 10 1234 5678'}
                      className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs bg-[#FAF9F5] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden transition-colors ${
                        errors.whatsapp
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-[#EBDED6] dark:border-[#3D332E] focus:border-[#C48D80]'
                      }`}
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp.message}</p>
                  )}
                </div>
              </div>

              {/* Field 4: Pieces Count Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'عدد القطع المطلوبة *' : 'Number of Pieces *'}
                  </label>
                  <span className="text-[11px] text-[#988172]">
                    {isAr ? 'اختاري الكمية التقريبية' : 'Select desired quantity'}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PIECES_PRESETS.map((preset) => {
                    const isSelected = selectedPieceOption === preset.id;
                    const label = isAr ? preset.labelAr : preset.labelEn;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePieceSelect(preset.id, label)}
                        className={`py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#C48D80] text-white border-[#C48D80] shadow-2xs font-semibold'
                            : 'bg-[#FAF9F5] dark:bg-[#1F1917] text-[#988172] border-[#EBDED6] dark:border-[#3D332E] hover:text-[#2B2320] dark:hover:text-[#FAF6F0] hover:border-[#C48D80]/60'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom piece count input when "custom" is selected */}
                {selectedPieceOption === 'custom' && (
                  <div className="mt-3 animate-in fade-in duration-200">
                    <div className="relative max-w-xs">
                      <Package className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={customPieceCount}
                        onChange={(e) => handleCustomCountChange(e.target.value)}
                        placeholder={isAr ? 'اكتبي عدد القطع (مثال: 12)' : 'Enter number of pieces (e.g. 12)'}
                        className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF9F5] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                      />
                    </div>
                  </div>
                )}

                {errors.pieces && (
                  <p className="text-[11px] text-rose-500 mt-1.5">{errors.pieces.message}</p>
                )}
              </div>

              {/* Field 5: Notes & Inquiries */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
                  {isAr ? 'ملحوظات أو تفاصيل الموديل (اختياري)' : 'Notes or Specific Requests (Optional)'}
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    {...register('notes')}
                    placeholder={
                      isAr
                        ? 'مثال: تفاصيل المقاسات، كود الفستان المطلوب، المناسبة، أو موعد التسليم المفضل...'
                        : 'e.g. Preferred sizes, dress style names, occasion date, or custom requests...'
                    }
                    className="w-full p-4 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF9F5] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80] transition-colors resize-none"
                  />
                </div>
                {errors.notes && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.notes.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#C48D80] hover:bg-[#B27B6E] text-white font-serif font-bold text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isAr ? 'إرسال الاستفسار وتأكيد الطلب' : 'Submit Inquiry'}</span>
                </Button>
              </div>

              {/* Reassuring note */}
              <div className="text-center pt-1 text-[11px] text-[#988172]">
                {isAr
                  ? '🔒 بياناتكِ آمنة تماماً، وسيتم التواصل معكِ عبر الواتساب أو الهاتف فقط لتأكيد التفاصيل.'
                  : '🔒 Your data is fully protected. We will reach out strictly via WhatsApp or phone to confirm details.'}
              </div>
            </form>
          )}
        </div>

        {/* Minimal Footer Info Strip */}
        <div className="mt-8 pt-6 border-t border-[#EBDED6]/60 dark:border-[#3D332E]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#988172]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#C48D80]" />
            <span>{isAr ? 'أوقات العمل والرد: يومياً 10:00 ص - 10:00 م (توقيت القاهرة)' : 'Working hours: Daily 10:00 AM - 10:00 PM (Cairo Time)'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-[#C48D80]" />
            <span>{isAr ? 'متجر واستوديو كوتور رواروسا - القاهرة، مصر' : 'ROAROSA Atelier & Boutique - Cairo, Egypt'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
