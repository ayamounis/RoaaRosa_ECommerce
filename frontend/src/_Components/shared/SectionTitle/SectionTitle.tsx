import React from 'react'
import { Inter } from 'next/font/google';

const inter = Inter({
    weight: '600',
    subsets: ['latin']
})
export default function SectionTitle({ title, desc }: { title: string, desc?: string  }) {
    return (
        <div>
            <div className='text-secondary2 flex gap-4 items-center'>
                <span className='block w-5 h-10 bg-secondary2 rounded-sm'></span>
                <span className='font-semibold'>{title}</span>
            </div>
            {desc && <h2 className={`text-text2 text-4xl  traking-[4%] mt-6 ${inter.className}`}>{desc}</h2>}
        </div>
    )
}
