export const dynamic = "force-dynamic";

import CartCardProduct from "@/_Components/shared/CartCardProduct/CartCardProduct";
import { IProduct } from "@/app/_interfaces/products";
import { getUserCart } from "@/app/_services/cart.services";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import ClearCartBtn from "./ClearCartBtn";

export type ItemType = {
  count: number;
  _id: string;
  price: number;
  product: IProduct;
};

export default async function Cart() {
  const cartRes = await getUserCart();
  const products = cartRes?.data?.products ?? [];
  const totalCartPrice = cartRes?.data?.totalCartPrice ?? 0;

  if (products.length <= 0) {
    return (
      <div className='container py-16 sm:py-24 text-center'>
        <div className='max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-4'>
          <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
            <ShoppingBag className='w-8 h-8' />
          </div>
          <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            Your Bag is Empty
          </h1>
          <p className='text-xs sm:text-sm text-[#988172]'>
            Explore our curated girls&apos; dresses, knitwear, and occasion collections to fill your bag with gentle essentials.
          </p>
          <div className='pt-2'>
            <Link
              href='/products'
              className='inline-flex items-center px-6 py-3 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs'
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container'>
        <div className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
          <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80]'>
            Review & Checkout
          </span>
          <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
            Shopping Bag ({products.length} {products.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Items List */}
          <div className='lg:col-span-8 flex flex-col gap-4'>
            {products.map((product: ItemType) => (
              <CartCardProduct key={product._id} product={product} />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-4 sticky top-36 p-6 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-4'>
            <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0] pb-3 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              Order Summary
            </h3>

            <div className='space-y-2 text-xs'>
              <div className='flex justify-between text-[#988172]'>
                <span>Subtotal</span>
                <span className='font-medium text-[#2B2320] dark:text-white'>{totalCartPrice} EGP</span>
              </div>
              <div className='flex justify-between text-[#988172]'>
                <span>Delivery</span>
                <span className='font-medium text-[#C48D80]'>
                  {totalCartPrice >= 1500 ? 'Free Express' : '60 EGP'}
                </span>
              </div>
              <div className='flex justify-between text-[#988172]'>
                <span>Taxes & Duties</span>
                <span className='font-medium text-[#2B2320] dark:text-white'>Included</span>
              </div>
            </div>

            <div className='pt-3 border-t border-[#EBDED6] dark:border-[#3D332E] flex justify-between items-baseline'>
              <span className='font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]'>Total</span>
              <span className='font-serif text-2xl font-bold text-[#C48D80]'>
                {totalCartPrice >= 1500 ? totalCartPrice : totalCartPrice + 60} EGP
              </span>
            </div>

            <Link
              href='/cart/payment'
              className='w-full py-3.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs'
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className='w-4 h-4' />
            </Link>

            <div className='pt-2'>
              <ClearCartBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
