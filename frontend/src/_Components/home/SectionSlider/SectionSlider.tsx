'use client'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ISectionSliderProps {
    uniqueId: string,
    items: React.ReactNode[] | undefined ;
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
    return (
        <Swiper
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            freeMode={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            grid={rows > 1 ? { rows, fill: 'row' } : undefined}
            modules={[FreeMode, Navigation, Autoplay]}
            className="mySwiper"
            navigation={{
                nextEl: `.review-next-${uniqueId}`,
                prevEl: `.review-prev-${uniqueId}`,
            }}
            breakpoints={breakpoints}
        >
            {
                items?.map((item, i) => (
                    <SwiperSlide key={i}>{item}</SwiperSlide>
                ))
            }

        </Swiper>
    )
}
