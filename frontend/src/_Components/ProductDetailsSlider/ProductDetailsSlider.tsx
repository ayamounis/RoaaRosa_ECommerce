'use client'
import Image from 'next/image';
import { useState } from 'react';

export default function ProductDetailsSlider({ imageCover, images, title }: { imageCover: string, images: string[], title: string }) {
    const [activeImage, setActiveImage] = useState(imageCover)
    return (
        <>
            <div className='flex items-center flex-col-reverse sm:flex-row gap-4'>
                <div className='w-full sm:h-[600px] overflow-auto '>
                    <div className='flex flex-row sm:flex-col gap-2 '>
                        {images.map((image) => (
                            <div key={image} className='w-full h-20  sm:h-[200px]  relative cursor-pointer' onClick={() => setActiveImage(image)}>
                                <Image className='object-contain' fill src={image} alt={title} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-full sm:w-2/3'>
                    <div className='relative w-75 h-80  sm:w-[500px] sm:h-[600px]'>
                        <Image className='object-cover' key={activeImage} src={activeImage} fill alt={title} />
                    </div>
                </div>
            </div>
        </>
    )
}
