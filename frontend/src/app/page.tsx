export const dynamic = "force-dynamic";

import MainSlider from "@/_Components/home/MainSlider/MainSlider";
import SliderSkeleton from "@/_Components/shared/SliderSkeleton/SliderSkeleton";
import { lazy, Suspense } from "react";
import CategoriesMenu from '../_Components/home/CategoriesMenu/CategoriesMenu';

export default async function Home() {
  const LazyCategorySlider = lazy(() => import('../_Components/home/CategorySlider/CategorySlider'))
  const LazyProductSlider = lazy(() => import('@/_Components/home/ProductSlider/ProductSlider'))
  return (
    <div className="">
      <div className='flex'>
        <CategoriesMenu />
        <MainSlider />
      </div>
      <div className="Today’s mt-20">
        <Suspense fallback={<SliderSkeleton />}>
          <LazyProductSlider />
        </Suspense>
        <div className="product-card flex gap-4">
        </div>
        <Suspense fallback={<SliderSkeleton />}>
          <LazyCategorySlider />
        </Suspense>
      </div>
    </div>
  );
}
