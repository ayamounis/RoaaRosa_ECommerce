import { getAllProducts } from '@/app/_services/products.services';
import GirlsTrendingClient from './GirlsTrendingClient';

interface GirlsTrendingSliderProps {
  activeCategory?: string;
}

export default async function GirlsTrendingSlider({
  activeCategory = 'all',
}: GirlsTrendingSliderProps) {
  const products = await getAllProducts();
  const trending = products?.slice(0, 24) ?? [];

  return (
    <section
      id='trending-section'
      className='py-14 sm:py-20 bg-[#FBF9F3] dark:bg-[#1F1917] transition-colors'
    >
      <div className='container'>
        <GirlsTrendingClient
          initialProducts={trending}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
}
