'use client';

import { useState } from 'react';
import { Truck, ShieldCheck, RefreshCw, CreditCard, MapPin, CheckCircle, ChevronRight, X } from 'lucide-react';

const EGYPT_GOVERNORATES = [
  { name: 'Cairo (القاهرة)', time: 'Next Day Delivery (24 hrs)', courier: 'Bosta & Aramex Express', cost: 'Free over 1,500 EGP (or 65 EGP)' },
  { name: 'Giza (الجيزة)', time: 'Next Day Delivery (24 hrs)', courier: 'Bosta & Aramex Express', cost: 'Free over 1,500 EGP (or 65 EGP)' },
  { name: 'Alexandria (الإسكندرية)', time: '1 - 2 Business Days', courier: 'Aramex Express', cost: 'Free over 1,500 EGP (or 75 EGP)' },
  { name: 'Delta (الدلتا - طنطا، المنصورة، الزقازيق)', time: '1 - 2 Business Days', courier: 'Bosta Express', cost: 'Free over 1,500 EGP (or 75 EGP)' },
  { name: 'Canal Cities (السويس، الإسماعيلية، بورسعيد)', time: '2 Business Days', courier: 'Bosta Express', cost: 'Free over 1,500 EGP (or 80 EGP)' },
  { name: 'Upper Egypt (الصعيد - المنيا، أسيوط، سوهاج)', time: '2 - 3 Business Days', courier: 'Aramex Domestic', cost: 'Free over 1,500 EGP (or 90 EGP)' },
  { name: 'Red Sea & Sinai (الغردقة، شرم الشيخ)', time: '2 - 4 Business Days', courier: 'Aramex Domestic', cost: 'Free over 1,500 EGP (or 100 EGP)' },
];

const TRUST_BADGES = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Express Delivery Egypt',
    desc: 'Free delivery on orders over 1,500 EGP with real-time tracking SMS and WhatsApp alerts.',
    modalTitle: 'ROAROSA Fast Egypt Dispatch',
    modalDetails: 'All orders placed before 3:00 PM are dispatched on the same day from our Cairo fulfillment hub. We partner with Bosta and Aramex to provide guaranteed doorstep delivery and cash-on-delivery inspection before payment.',
  },
  {
    id: 'skin',
    icon: ShieldCheck,
    title: 'Sensitive-Skin Certified',
    desc: 'Hypoallergenic certified organic cottons, nickel-free zippers & irritation-free seams.',
    modalTitle: 'Certified Sensitive-Skin Safe',
    modalDetails: 'Every garment undergoes dermatological softness review. We use only GOTS-certified organic cotton linings, water-based natural dyes, and flat-lock seams designed to never scratch or redden tender childhood skin.',
  },
  {
    id: 'returns',
    icon: RefreshCw,
    title: '14-Day Free Returns',
    desc: 'Hassle-free size exchanges and courier pick-up right from your doorstep in Egypt.',
    modalTitle: 'Doorstep Size Exchanges & 14-Day Returns',
    modalDetails: 'If the size is not ideal, simply submit a size swap request on your profile or contact our Cairo concierge. Our courier will bring the replacement size and pick up the original item right at your doorstep.',
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Cash on Delivery & Cards',
    desc: 'Pay with Visa, Mastercard, Meeza cards, ValU 0% interest installments, or Cash on Delivery.',
    modalTitle: 'Secure Egyptian Payment Options',
    modalDetails: 'We support 100% Cash on Delivery across all governorates, Meeza national debit cards, Visa, Mastercard, and flexible installments up to 12 months with ValU, Souhoola, and Sympl.',
  },
];

export default function TrustFeatures() {
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
                <span>Instant Egypt Delivery Estimator</span>
              </div>
              <h3 className='font-serif text-xl sm:text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                Check Delivery Timeline To Your City
              </h3>
              <p className='text-xs text-[#988172] leading-relaxed'>
                Select your Egyptian governorate to view guaranteed delivery schedules and doorstep inspection terms.
              </p>
            </div>

            <div className='lg:col-span-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
              <div className='flex-1'>
                <label className='block text-[11px] font-semibold text-[#988172] mb-1.5 uppercase'>
                  Select Governorate:
                </label>
                <select
                  value={selectedGovIdx}
                  onChange={(e) => setSelectedGovIdx(Number(e.target.value))}
                  className='w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-xs font-semibold text-[#2B2320] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C48D80]'
                >
                  {EGYPT_GOVERNORATES.map((gov, idx) => (
                    <option key={gov.name} value={idx}>
                      {gov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] sm:min-w-[240px]'>
                <div className='text-[11px] font-bold text-[#C48D80] flex items-center gap-1.5'>
                  <CheckCircle className='w-3.5 h-3.5' />
                  <span>{selectedGov.time}</span>
                </div>
                <div className='text-[10px] text-[#988172] mt-0.5'>
                  Courier: {selectedGov.courier}
                </div>
                <div className='text-[10px] text-[#2B2320] dark:text-[#FAF6F0] font-medium mt-1'>
                  {selectedGov.cost}
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
                      Learn more
                      <ChevronRight className='w-3 h-3' />
                    </span>
                  </div>

                  <div>
                    <h3 className='text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors'>
                      {badge.title}
                    </h3>
                    <p className='text-xs text-[#988172] mt-1.5 leading-relaxed'>
                      {badge.desc}
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
              className='relative w-full max-w-lg bg-white dark:bg-[#28211E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] space-y-4'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalBadge(null)}
                aria-label='Close'
                className='absolute top-4 right-4 size-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-white flex items-center justify-center hover:bg-[#C48D80] hover:text-white transition-colors cursor-pointer'
              >
                <X className='w-4 h-4' />
              </button>

              <div className='size-12 rounded-2xl bg-[#C48D80]/15 text-[#C48D80] flex items-center justify-center mb-2'>
                <activeModalBadge.icon className='w-6 h-6' />
              </div>

              <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-white'>
                {activeModalBadge.modalTitle}
              </h3>

              <p className='text-xs sm:text-sm text-[#5A4F4A] dark:text-[#D1C5BD] leading-relaxed'>
                {activeModalBadge.modalDetails}
              </p>

              <div className='pt-4 border-t border-[#EBDED6] dark:border-[#3D332E] flex justify-end'>
                <button
                  type='button'
                  onClick={() => setActiveModalBadge(null)}
                  className='px-6 py-2.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold cursor-pointer'
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
