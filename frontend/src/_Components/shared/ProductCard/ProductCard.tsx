'use client'
import { Icons } from '@/_Components/icons/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import AddToWishlistBtn from '../AddToWishlistBtn/AddToWishlistBtn';
import Stars from '../Stars/Stars';
import TrashWishlistBtn from '../TrashWishlistBtn/TrashWishlistBtn';
import { ProductCardProps } from './ProductCard.types';

export default function ProductCard({ product, from }: { product: ProductCardProps, from?: string }) {
    const discount = useRef<number>(0);
    discount.current = Math.round((product?.price - (product?.priceAfterDiscount || 0)) / product?.price * 100)
    return (
        <Link href={`/productDetails/${product?.id}`} className='active:scale-105'>
            <div className='Card group mx-auto w-fit h-100'>
                <div className='CardImage overflow-hidden relative w-[270px] h-[250px] rounded-lg flex-center group-hover:shadow-sm duration-400 bg-secondary/30 dark:bg-secondary'>
                    <Image className='object-cover sm:object-contain object-center group-hover:scale-105 duration-200' fill src={product?.imageCover} alt={product?.title} />
                    <AddToCartBtn id={product?.id} />
                    {/* floating lables */}
                    {product?.priceAfterDiscount &&
                        <span className='absolute top-3 left-3 text-xs bg-secondary2 text-text py-2 px-3 rounded-lg group-hover:scale-90 duration-200'>{discount.current}%</span>
                    }
                    {from == 'wishlist' ?
                        <TrashWishlistBtn productId={product.id} />
                        :
                        <div className='absolute top-3 right-3 flex gap-2 flex-col text-xs'>
                            <AddToWishlistBtn  productId={product?.id} />
                            <span className='bg-Bg size-[34] group-hover:-translate-x-0 translate-x-20 rounded-full flex-center cursor-pointer group-hover:scale-105 duration-200'><Icons.eye strokeWidth={1.5} className='size-6 flex-center ' /></span>
                        </div>
                    }
                </div>

                <div className='CardContent mt-4 flex flex-col gap-2'>
                    <p className='font-medium '>{product?.title.split(' ', 2).join(' ')}</p>
                    <div className='Price flex gap-3'>
                        {product?.priceAfterDiscount ?
                            <>
                                <span className='text-secondary2 font-medium'>${product?.priceAfterDiscount}</span>
                                <span className='line-through text-text2/50 font-medium'>${product?.price} </span>
                            </>
                            :
                            <span className='text-secondary2 font-medium'>${product?.price}</span>
                        }
                    </div>
                    <div className='Rating flex gap-2'>
                        <Stars ratingsAverage={product?.ratingsAverage} />
                        <span className='font-semibold text-sm text-text2/50'>({product?.ratingsQuantity})</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
