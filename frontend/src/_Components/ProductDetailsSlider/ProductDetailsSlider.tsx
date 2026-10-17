'use client'
import Image from 'next/image';
import { useState } from 'react';

export default function ProductDetailsSlider({ imageCover, images, title }: { imageCover: string, images: string[], title: string }) {
    const [activeImage, setActiveImage] = useState(imageCover)
    return (
        <div className='flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 items-start'>
            {/* Left Thumbnail Strip */}
            {images.length > 1 && (
                <div className='flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar max-h-[560px] flex-shrink-0'>
                    {images.map((image, idx) => {
                        const isActive = activeImage === image;
                        return (
                            <button
                                type='button'
                                key={idx}
                                onClick={() => setActiveImage(image)}
                                className={`relative w-16 h-20 sm:w-20 sm:h-26 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-[#FAF7F2] ${
                                    isActive ? 'border-[#C48D80] shadow-sm' : 'border-[#EBDED6] dark:border-[#3D332E] opacity-70 hover:opacity-100'
                                }`}
                            >
                                <Image
                                    className='object-cover object-top'
                                    fill
                                    sizes='80px'
                                    src={image}
                                    alt={`${title} thumbnail ${idx + 1}`}
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Active Portrait Image */}
            <div className='relative flex-1 w-full aspect-[3/4] max-h-[580px] rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]'>
                <Image
                    className='object-cover object-top transition-all duration-300'
                    key={activeImage}
                    src={activeImage}
                    fill
                    priority
                    sizes='(max-width: 1024px) 100vw, 50vw'
                    alt={title}
                />
            </div>
        </div>
    )
}
