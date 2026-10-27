import { Skeleton } from '@/_Components/ui/skeleton';
import React from 'react';

export default function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`group relative flex flex-col w-full max-w-[320px] mx-auto bg-white dark:bg-[#28211E] rounded-2xl overflow-hidden border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs ${
        className || ''
      }`}
    >
      {/* 3:4 Aspect Ratio Image Skeleton */}
      <div className='relative w-full aspect-[3/4] min-h-[260px] sm:min-h-[300px] overflow-hidden bg-[#FAF7F2] dark:bg-[#241E1C]'>
        <Skeleton className='w-full h-full rounded-none' />
      </div>

      {/* Product Meta & Details Skeleton */}
      <div className='p-3.5 flex flex-col gap-2 flex-1 justify-between'>
        {/* Swatches placeholder */}
        <div className='flex items-center justify-between py-0.5'>
          <div className='flex items-center gap-1.5'>
            <Skeleton className='size-3 rounded-full' />
            <Skeleton className='size-3 rounded-full' />
            <Skeleton className='size-3 rounded-full' />
            <Skeleton className='size-3 rounded-full' />
          </div>
          <Skeleton className='h-2.5 w-12 rounded' />
        </div>

        {/* Title placeholder */}
        <div className='space-y-1.5'>
          <Skeleton className='h-4 w-4/5 rounded' />
        </div>

        {/* Price placeholder */}
        <div className='flex items-baseline gap-2 pt-0.5'>
          <Skeleton className='h-5 w-20 rounded' />
          <Skeleton className='h-3.5 w-12 rounded' />
        </div>

        {/* Rating placeholder */}
        <div className='flex items-center gap-1.5 pt-0.5'>
          <Skeleton className='h-3.5 w-24 rounded' />
          <Skeleton className='h-3 w-8 rounded' />
        </div>
      </div>
    </div>
  );
}
