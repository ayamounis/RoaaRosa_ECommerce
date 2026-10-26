'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import AddToWishlistBtn from '../AddToWishlistBtn/AddToWishlistBtn';
import Stars from '../Stars/Stars';
import TrashWishlistBtn from '../TrashWishlistBtn/TrashWishlistBtn';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { ProductCardProps } from './ProductCard.types';
import { useLanguage } from '@/context/LanguageContext';

const SWATCH_AR_NAMES: Record<string, string> = {
  'Dusty Rose': 'وردي مغبر',
  'Warm Nude': 'بيج دافئ',
  'Taupe': 'رمادي داكن',
  'Cream': 'كريمي',
  'Sage Green': 'أخضر هادئ',
  'Soft Ivory': 'عاجي ناعم',
  'Blush Pink': 'وردي فاتح',
  'Oatmeal': 'شوفان طبيعي',
};

export default function ProductCard({
  product,
  from,
  dataAos = 'fade-up',
  dataAosDelay = 0,
}: {
  product: ProductCardProps;
  from?: string;
  dataAos?: string;
  dataAosDelay?: number;
}) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(0);

  const productId = product?.id || product?._id || '';
  const discount = product?.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  const defaultSwatches = [
    { name: 'Dusty Rose', hex: '#C48D80' },
    { name: 'Warm Nude', hex: '#E5C2AF' },
    { name: 'Taupe', hex: '#988172' },
    { name: 'Cream', hex: '#FBF9F3' },
  ];
  const swatches = product?.swatches && product.swatches.length > 0 ? product.swatches : defaultSwatches;
  const currentSwatch = swatches[selectedSwatchIdx] || swatches[0];
  const currentSwatchName = isAr
    ? SWATCH_AR_NAMES[currentSwatch.name] || currentSwatch.name
    : currentSwatch.name;

  const currencyLabel = isAr ? 'ج.م' : 'EGP';

  return (
    <>
      <div
        data-aos={dataAos}
        data-aos-delay={dataAosDelay}
        className='group relative flex flex-col w-full max-w-[320px] mx-auto bg-white dark:bg-[#28211E] rounded-2xl overflow-hidden border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs hover:shadow-xl hover:border-[#C48D80] transition-all duration-300'
      >
        {/* Top 3:4 Portrait Image Container */}
        <div className='relative w-full aspect-[3/4] min-h-[260px] sm:min-h-[300px] overflow-hidden bg-[#FAF7F2] dark:bg-[#241E1C]'>
          <Link href={`/productDetails/${productId}`} className='block w-full h-full relative'>
            <Image
              className='object-cover object-top group-hover:scale-106 duration-700 ease-out'
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              src={product?.imageCover}
              alt={product?.title || "ROAROSA Girls' Fashion"}
            />
          </Link>

          {/* Floating Discount Pill */}
          {discount > 0 && (
            <span className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} text-[11px] font-bold bg-[#C48D80] text-white py-1 px-2.5 rounded-full shadow-xs`}>
              -{discount}%
            </span>
          )}

          {/* Age Range Badge */}
          {product?.ageRangeLabel && (
            <span className={`absolute bottom-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} text-[10px] font-medium bg-[#2B2320]/80 backdrop-blur-xs text-white py-0.5 px-2 rounded-md`}>
              {product.ageRangeLabel}
            </span>
          )}

          {/* Wishlist / Trash Button */}
          <div className={`absolute top-2.5 ${isRtl ? 'left-2.5' : 'right-2.5'} z-10`}>
            {from === 'wishlist' ? (
              <TrashWishlistBtn productId={productId} />
            ) : (
              <div className='shadow-xs rounded-full bg-white/90 dark:bg-[#28211E]/90 backdrop-blur-xs'>
                <AddToWishlistBtn productId={productId} />
              </div>
            )}
          </div>

          {/* Quick View Button (Centers on hover) */}
          <div className='absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
            <button
              type='button'
              onClick={() => setIsQuickViewOpen(true)}
              className='pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#28211E]/95 text-[#2B2320] dark:text-white text-xs font-semibold shadow-lg hover:bg-[#C48D80] hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 cursor-pointer active:scale-95'
            >
              <Eye className='w-3.5 h-3.5' />
              <span>{isAr ? 'نظرة سريعة' : 'Quick View'}</span>
            </button>
          </div>

          {/* Add To Cart Bar - slides up on hover */}
          <div className='absolute bottom-0 inset-x-0 z-10 transition-transform duration-300 translate-y-full group-hover:translate-y-0'>
            <AddToCartBtn id={productId} />
          </div>
        </div>

        {/* Product Meta & Details */}
        <div className='p-3.5 flex flex-col gap-1.5 flex-1 justify-between'>
          {/* Interactive Color Swatch Dots */}
          <div className='flex items-center justify-between py-0.5'>
            <div className='flex items-center gap-1.5'>
              {swatches.slice(0, 4).map((swatch, idx) => (
                <button
                  key={idx}
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSwatchIdx(idx);
                  }}
                  title={isAr ? SWATCH_AR_NAMES[swatch.name] || swatch.name : swatch.name}
                  style={{ backgroundColor: swatch.hex }}
                  className={`size-3 rounded-full border border-black/15 shadow-2xs transition-transform cursor-pointer ${
                    selectedSwatchIdx === idx
                      ? 'scale-125 ring-2 ring-offset-1 ring-[#C48D80]'
                      : 'hover:scale-110'
                  }`}
                />
              ))}
              {swatches.length > 4 && (
                <span className='text-[10px] text-[#988172]'>+{swatches.length - 4}</span>
              )}
            </div>
            <span className='text-[10px] text-[#988172] font-medium'>
              {currentSwatchName}
            </span>
          </div>

          {/* Title */}
          <Link href={`/productDetails/${productId}`}>
            <h3 className='text-xs sm:text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0] line-clamp-1 hover:text-[#C48D80] transition-colors'>
              {product?.title}
            </h3>
          </Link>

          {/* Price in EGP */}
          <div className='flex items-baseline gap-2 pt-0.5'>
            {product?.priceAfterDiscount ? (
              <>
                <span className='text-sm sm:text-base font-bold text-[#C48D80]'>
                  {product.priceAfterDiscount} {currencyLabel}
                </span>
                <span className='text-xs line-through text-[#988172]/70 font-normal'>
                  {product.price} {currencyLabel}
                </span>
              </>
            ) : (
              <span className='text-sm sm:text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {product?.price} {currencyLabel}
              </span>
            )}
          </div>

          {/* Rating */}
          {product?.ratingsAverage !== undefined && (
            <div className='flex items-center gap-1 pt-0.5 text-xs'>
              <Stars ratingsAverage={product.ratingsAverage} />
              <span className='text-[11px] text-[#988172]'>
                ({product.ratingsQuantity ?? 0})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Lightbox Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
