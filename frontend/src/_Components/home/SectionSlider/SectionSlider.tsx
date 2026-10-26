'use client'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLanguage } from '@/context/LanguageContext';

interface ISectionSliderProps {
    uniqueId: string;
    items: React.ReactNode[] | undefined;
    slidesPerView?: number;
    spaceBetween?: number;
    rows?: number;
    autoplay?: boolean;
    navigation?: boolean;
    breakpoints?: Record<string, { slidesPerView: number }>;
}

export default function SectionSlider({
    uniqueId,
    items,
    slidesPerView = 3.5,
    spaceBetween = 30,
    rows = 1,
    breakpoints = {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1.5 },
        1024: { slidesPerView: 3.5 },
    },
}: ISectionSliderProps) {
    const { isRtl } = useLanguage();

    return (
        <Swiper
            key={`${uniqueId}-${isRtl ? 'rtl' : 'ltr'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            freeMode={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            grid={rows > 1 ? { rows, fill: 'row' } : undefined}
            modules={[FreeMode, Navigation, Autoplay]}
            className="mySwiper w-full"
            navigation={{
                nextEl: `.review-next-${uniqueId}`,
                prevEl: `.review-prev-${uniqueId}`,
            }}
            breakpoints={breakpoints}
        >
            {items?.map((item, i) => (
                <SwiperSlide key={i} className="!h-auto flex justify-center">
                    {item}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
