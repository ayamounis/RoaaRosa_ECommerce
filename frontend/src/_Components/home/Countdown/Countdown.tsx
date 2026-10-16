'use client'
import { Inter } from 'next/font/google'
import React, { useEffect, useState } from 'react'

const inter = Inter({
    weight: '700',
    subsets: ['latin']
})

export default function Countdown() {
    const [endTime, setEndTime] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const savedEndTime = localStorage.getItem('flashSaleEndTime')

        if (savedEndTime) {
            setEndTime(Number(savedEndTime))
        } else {
            const newEndTime = new Date().getTime() + 4 * 24 * 60 * 60 * 1000
            localStorage.setItem('flashSaleEndTime', String(newEndTime))
            setEndTime(newEndTime)
        }
    }, [])

    useEffect(() => {
        if (!endTime) return

        const updateTime = () => {
            const diff = endTime - Date.now()
            setTimeLeft(diff > 0 ? diff : 0)
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [endTime])

    if (endTime === null) return null

    if (timeLeft <= 0) {
        return 
    }

    const seconds = Math.floor((timeLeft / 1000) % 60)
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
    const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24)
    const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24)

    return (
        <div className='Counter flex gap-2 text-text2 '>
            <div className='CounterItem'>
                <div className='CounterNumber flex flex-col'>
                    <span className='font-medium text-xs'>Days</span>
                    <span className={`text-[32px] ${inter.className}`}>{days}</span>
                </div>
            </div>

            <span className='text-hover-button2 text-2xl px-1 mt-6'>:</span>

            <div className='CounterItem'>
                <div className='CounterNumber flex flex-col'>
                    <span className='font-medium text-xs'>Hours</span>
                    <span className={`text-[32px] ${inter.className}`}>{hours}</span>
                </div>
            </div>

            <span className='text-hover-button2 text-2xl px-1 mt-6'>:</span>

            <div className='CounterItem'>
                <div className='CounterNumber flex flex-col'>
                    <span className='font-medium text-xs'>Minutes</span>
                    <span className={`text-[32px] ${inter.className}`}>{minutes}</span>
                </div>
            </div>

            <span className='text-hover-button2 text-2xl px-1 mt-6'>:</span>

            <div className='CounterItem'>
                <div className='CounterNumber flex flex-col'>
                    <span className='font-medium text-xs'>Seconds</span>
                    <span className={`text-[32px] ${inter.className}`}>{seconds}</span>
                </div>
            </div>
        </div>
    )
}
