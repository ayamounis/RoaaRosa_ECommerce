import ProductSkeleton from '@/_Components/shared/ProductSkeleton/ProductSkeleton';
import { Skeleton } from '@/_Components/ui/skeleton';

export default function Loading() {
  return (
    <div className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container'>
        {/* Header Skeleton */}
        <div className='mb-6 space-y-2'>
          {/* Breadcrumb skeleton */}
          <div className='flex items-center gap-2 mb-6'>
            <Skeleton className='h-3.5 w-16' />
            <Skeleton className='h-3.5 w-3' />
            <Skeleton className='h-3.5 w-20' />
            <Skeleton className='h-3.5 w-3' />
            <Skeleton className='h-3.5 w-28' />
          </div>

          {/* Department Banner Skeleton */}
          <div className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-36' />
              <Skeleton className='h-8 sm:h-9 w-64 sm:w-80' />
            </div>
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Body Layout: Desktop Filter Sidebar + Product Grid */}
        <div className='flex gap-8 relative items-start'>
          {/* Desktop Filter Sidebar Skeleton */}
          <aside className='hidden lg:block w-64 flex-shrink-0'>
            <div className='sticky top-32 p-5 bg-white dark:bg-[#28211E] rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-6'>
              {/* Filter title */}
              <div className='flex items-center justify-between pb-3 border-b border-[#EBDED6] dark:border-[#3D332E]'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='size-4 rounded' />
              </div>

              {/* Age filter skeleton */}
              <div className='space-y-2.5'>
                <Skeleton className='h-3.5 w-24' />
                <div className='flex flex-wrap gap-1.5'>
                  <Skeleton className='h-7 w-20 rounded-full' />
                  <Skeleton className='h-7 w-24 rounded-full' />
                  <Skeleton className='h-7 w-22 rounded-full' />
                </div>
              </div>

              {/* Categories filter skeleton */}
              <div className='space-y-2.5'>
                <Skeleton className='h-3.5 w-24' />
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-full rounded' />
                  <Skeleton className='h-5 w-4/5 rounded' />
                  <Skeleton className='h-5 w-3/4 rounded' />
                </div>
              </div>

              {/* Colors filter skeleton */}
              <div className='space-y-2.5'>
                <Skeleton className='h-3.5 w-24' />
                <div className='flex gap-2.5'>
                  <Skeleton className='size-7 rounded-full' />
                  <Skeleton className='size-7 rounded-full' />
                  <Skeleton className='size-7 rounded-full' />
                  <Skeleton className='size-7 rounded-full' />
                </div>
              </div>

              {/* Button skeleton */}
              <Skeleton className='h-9 w-full rounded-full' />
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className='flex-1 min-w-0'>
            <div className='grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
