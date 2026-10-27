'use client';

import { useState } from 'react';
import { Truck, ShieldCheck, RefreshCw, CreditCard, MapPin, CheckCircle, ChevronRight, ChevronLeft, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const EGYPT_GOVERNORATES = [
  { name: 'Cairo (القاهرة)', nameAr: 'القاهرة', time: 'Next Day Delivery (24 hrs)', timeAr: 'توصيل في اليوم التالي (خلال 24 ساعة)', courier: 'Bosta & Aramex Express', courierAr: 'شحن سريع عبر بوسطة وأرامكس', cost: 'Free over 1,500 EGP (or 65 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 65 ج.م)' },
  { name: 'Giza (الجيزة)', nameAr: 'الجيزة', time: 'Next Day Delivery (24 hrs)', timeAr: 'توصيل في اليوم التالي (خلال 24 ساعة)', courier: 'Bosta & Aramex Express', courierAr: 'شحن سريع عبر بوسطة وأرامكس', cost: 'Free over 1,500 EGP (or 65 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 65 ج.م)' },
  { name: 'Alexandria (الإسكندرية)', nameAr: 'الإسكندرية', time: '1 - 2 Business Days', timeAr: 'خلال 1 - 2 أيام عمل', courier: 'Aramex Express', courierAr: 'أرامكس إكسبريس', cost: 'Free over 1,500 EGP (or 75 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 75 ج.م)' },
  { name: 'Delta (الدلتا - طنطا، المنصورة، الزقازيق)', nameAr: 'محافظات الدلتا (طنطا، المنصورة، الزقازيق)', time: '1 - 2 Business Days', timeAr: 'خلال 1 - 2 أيام عمل', courier: 'Bosta Express', courierAr: 'بوسطة إكسبريس', cost: 'Free over 1,500 EGP (or 75 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 75 ج.م)' },
  { name: 'Canal Cities (السويس، الإسماعيلية، بورسعيد)', nameAr: 'مدن القناة (السويس، الإسماعيلية، بورسعيد)', time: '2 Business Days', timeAr: 'خلال يومي عمل', courier: 'Bosta Express', courierAr: 'بوسطة إكسبريس', cost: 'Free over 1,500 EGP (or 80 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 80 ج.م)' },
  { name: 'Upper Egypt (الصعيد - المنيا، أسيوط، سوهاج)', nameAr: 'محافظات الصعيد (المنيا، أسيوط، سوهاج، قنا)', time: '2 - 3 Business Days', timeAr: 'خلال 2 - 3 أيام عمل', courier: 'Aramex Domestic', courierAr: 'أرامكس للشحن الداخلي', cost: 'Free over 1,500 EGP (or 90 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 90 ج.م)' },
  { name: 'Red Sea & Sinai (الغردقة، شرم الشيخ)', nameAr: 'البحر الأحمر وجنوب سيناء (الغردقة، شرم الشيخ)', time: '2 - 4 Business Days', timeAr: 'خلال 2 - 4 أيام عمل', courier: 'Aramex Domestic', courierAr: 'أرامكس للشحن الداخلي', cost: 'Free over 1,500 EGP (or 100 EGP)', costAr: 'مجاني للطلبات فوق 1,500 ج.م (أو 100 ج.م)' },
];

const TRUST_BADGES = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Express Delivery Egypt',
    titleAr: 'توصيل سريع لكافة محافظات مصر',
    desc: 'Free delivery on orders over 1,500 EGP with real-time tracking SMS and WhatsApp alerts.',
    descAr: 'شحن سريع مجاني للطلبات فوق 1,500 ج.م مع متابعة لحظية عبر رسائل SMS والواتساب.',
    modalTitle: 'ROAROSA Fast Egypt Dispatch',
    modalTitleAr: 'خدمة التوصيل السريع من رواروسا',
    modalDetails: 'All orders placed before 3:00 PM are dispatched on the same day from our Cairo fulfillment hub. We partner with Bosta and Aramex to provide guaranteed doorstep delivery and cash-on-delivery inspection before payment.',
    modalDetailsAr: 'يتم شحن جميع الطلبات المقدمة قبل الساعة 3:00 عصراً في نفس اليوم مباشرة من مركز التوزيع بالقاهرة. نتعاون مع بوسطة وأرامكس لضمان وصول الطلب لباب بيتك مع إمكانية المعاينة قبل الاستلام.',
  },
  {
    id: 'skin',
    icon: ShieldCheck,
    title: 'Sensitive-Skin Certified',
    titleAr: 'آمنة ومختبرة للبشرة الحساسة',
    desc: 'Hypoallergenic certified organic cottons, nickel-free zippers & irritation-free seams.',
    descAr: 'أقطان عضوية معتمدة مضادة للحساسية، سوست خالية من النيكل، وخياطة ناعمة لا تسبب أي احمرار.',
    modalTitle: 'Certified Sensitive-Skin Safe',
    modalTitleAr: 'شهادة أمان ونعومة البشرة الحساسة',
    modalDetails: 'Every garment undergoes dermatological softness review. We use only GOTS-certified organic cotton linings, water-based natural dyes, and flat-lock seams designed to never scratch or redden tender childhood skin.',
    modalDetailsAr: 'تخضع جميع قطع رواروسا لاختبارات نعومة صارمة. نعتمد فقط على بطانات قطنية عضوية 100% وأصباغ مائية طبيعية وخياطة مسطحة تضمن راحة تامة لبشرة البنات الرقيقة.',
  },
  {
    id: 'returns',
    icon: RefreshCw,
    title: '14-Day Free Returns',
    titleAr: 'إرجاع واستبدال مجاني خلال 14 يوماً',
    desc: 'Hassle-free size exchanges and courier pick-up right from your doorstep in Egypt.',
    descAr: 'استبدال فوري للمقاسات واسترجاع سهل مع استلام المندوب للقطع مباشرة من باب منزلك.',
    modalTitle: 'Doorstep Size Exchanges & 14-Day Returns',
    modalTitleAr: 'استبدال المقاسات من باب منزلك بكل سهولة',
    modalDetails: 'If the size is not ideal, simply submit a size swap request on your profile or contact our Cairo concierge. Our courier will bring the replacement size and pick up the original item right at your doorstep.',
    modalDetailsAr: 'إذا كان المقاس غير مناسب، ما عليكِ سوى تقديم طلب استبدال أو التواصل مع خدمة العملاء. سيصلك المندوب بالمقاس الجديد ويستلم القطعة الحالية من باب منزلك.',
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Cash on Delivery & Cards',
    titleAr: 'الدفع عند الاستلام وبكافة البطاقات',
    desc: 'Pay with Visa, Mastercard, Meeza cards, ValU 0% interest installments, or Cash on Delivery.',
    descAr: 'خيارات دفع مرنة: دفع نقدي عند الاستلام، بطاقات ميزة، فيزا، ماستركارد، وتقسيط مع ڤاليو وسهولة.',
    modalTitle: 'Secure Egyptian Payment Options',
    modalTitleAr: 'وسائل دفع آمنة ومعتمدة في مصر',
    modalDetails: 'We support 100% Cash on Delivery across all governorates, Meeza national debit cards, Visa, Mastercard, and flexible installments up to 12 months with ValU, Souhoola, and Sympl.',
    modalDetailsAr: 'ندعم الدفع نقداً عند الاستلام بنسبة 100% في جميع المحافظات، بالإضافة لبطاقات ميزة الوطنية، فيزا، ماستركارد، وخطط تقسيط مرنة بدون فوائد.',
  },
];

export default function TrustFeatures() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [selectedGovIdx, setSelectedGovIdx] = useState(0);
  const [activeModalBadge, setActiveModalBadge] = useState<typeof TRUST_BADGES[0] | null>(null);

  const selectedGov = EGYPT_GOVERNORATES[selectedGovIdx];

  return (
    <section className='py-14 sm:py-20 bg-[#FBF9F3] dark:bg-[#1F1917] transition-colors'>
      <div className='container space-y-10'>
        {/* Interactive Governorate Delivery Calculator Banner */}
        <div
          className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-xs'
          data-aos='fade-up'
        >
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center'>
            <div className='lg:col-span-6 space-y-2'>
              <div className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C48D80]'>
                <MapPin className='w-4 h-4' />
                <span>{isAr ? 'حاسبة ومواعيد التوصيل في مصر' : 'Instant Egypt Delivery Estimator'}</span>
              </div>
              <h3 className='font-serif text-xl sm:text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'اعرفي موعد وصول طلبك لمحافظتك' : 'Check Delivery Timeline To Your City'}
              </h3>
              <p className='text-xs text-[#988172] leading-relaxed'>
                {isAr
                  ? 'اختاري محافظتك لمعرفة مواعيد التوصيل المضمونة وخدمة المعاينة عند الاستلام لباب منزلك.'
                  : 'Select your Egyptian governorate to view guaranteed delivery schedules and doorstep inspection terms.'}
              </p>
            </div>

            <div className='lg:col-span-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
              <div className='flex-1'>
                <label className='block text-[11px] font-semibold text-[#988172] mb-1.5 uppercase'>
                  {isAr ? 'اختاري المحافظة:' : 'Select Governorate:'}
                </label>
                <div className='relative'>
                  <select
                    value={selectedGovIdx}
                    onChange={(e) => setSelectedGovIdx(Number(e.target.value))}
                    className={`w-full appearance-none rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-xs font-semibold text-[#2B2320] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C48D80] cursor-pointer py-3 transition-colors ${
                      isRtl ? 'pl-10 pr-4 text-right' : 'pr-10 pl-4 text-left'
                    }`}
                  >
                    {EGYPT_GOVERNORATES.map((gov, idx) => (
                      <option
                        key={gov.name}
                        value={idx}
                        className='bg-white dark:bg-[#1F1917] text-[#2B2320] dark:text-white py-1.5'
                      >
                        {isAr ? gov.nameAr : gov.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center text-[#988172] dark:text-[#C48D80] transition-colors ${
                      isRtl ? 'left-3.5' : 'right-3.5'
                    }`}
                  >
                    <ChevronDown className='w-4 h-4' />
                  </div>
                </div>
              </div>

              <div className='p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] sm:min-w-[240px]'>
                <div className='text-[11px] font-bold text-[#C48D80] flex items-center gap-1.5'>
                  <CheckCircle className='w-3.5 h-3.5' />
                  <span>{isAr ? selectedGov.timeAr : selectedGov.time}</span>
                </div>
                <div className='text-[10px] text-[#988172] mt-0.5'>
                  {isAr ? `شركة الشحن: ${selectedGov.courierAr}` : `Courier: ${selectedGov.courier}`}
                </div>
                <div className='text-[10px] text-[#2B2320] dark:text-[#FAF6F0] font-medium mt-1'>
                  {isAr ? selectedGov.costAr : selectedGov.cost}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Guarantee Cards with AOS and Interactive Modals */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                onClick={() => setActiveModalBadge(badge)}
                data-aos='fade-up'
                data-aos-delay={(idx + 1) * 100}
                className='group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs hover:shadow-lg hover:border-[#C48D80] transition-all duration-300 cursor-pointer'
              >
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[#C48D80] group-hover:bg-[#C48D80] group-hover:text-white transition-colors duration-300 flex-shrink-0'>
                      <Icon className='w-5 h-5' />
                    </div>
                    <span className='text-[10px] font-semibold text-[#988172] uppercase tracking-wider group-hover:text-[#C48D80] transition-colors flex items-center gap-0.5'>
                      {isAr ? 'معرفة المزيد' : 'Learn more'}
                      {isRtl ? <ChevronLeft className='w-3 h-3' /> : <ChevronRight className='w-3 h-3' />}
                    </span>
                  </div>

                  <div>
                    <h3 className='text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors'>
                      {isAr ? badge.titleAr : badge.title}
                    </h3>
                    <p className='text-xs text-[#988172] mt-1.5 leading-relaxed'>
                      {isAr ? badge.descAr : badge.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Detail Modal */}
        {activeModalBadge && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'
            onClick={() => setActiveModalBadge(null)}
          >
            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className='relative w-full max-w-lg bg-white dark:bg-[#28211E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] space-y-4'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalBadge(null)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} size-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-white flex items-center justify-center hover:bg-[#C48D80] hover:text-white transition-colors cursor-pointer`}
              >
                <X className='w-4 h-4' />
              </button>

              <div className='size-12 rounded-2xl bg-[#C48D80]/15 text-[#C48D80] flex items-center justify-center mb-2'>
                <activeModalBadge.icon className='w-6 h-6' />
              </div>

              <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-white'>
                {isAr ? activeModalBadge.modalTitleAr : activeModalBadge.modalTitle}
              </h3>

              <p className='text-xs sm:text-sm text-[#5A4F4A] dark:text-[#D1C5BD] leading-relaxed'>
                {isAr ? activeModalBadge.modalDetailsAr : activeModalBadge.modalDetails}
              </p>

              <div className='pt-4 border-t border-[#EBDED6] dark:border-[#3D332E] flex justify-end'>
                <button
                  type='button'
                  onClick={() => setActiveModalBadge(null)}
                  className='px-6 py-2.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold cursor-pointer'
                >
                  {isAr ? 'حسناً، فهمت' : 'Understood'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
