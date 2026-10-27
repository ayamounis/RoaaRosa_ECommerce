export const dynamic = "force-dynamic";

import HeroBanner from "@/_Components/home/HeroBanner/HeroBanner";
import ShopByCategory from "@/_Components/home/ShopByCategory/ShopByCategory";
import ShopByAge from "@/_Components/home/ShopByAge/ShopByAge";
import TrendingNow from "@/_Components/home/TrendingNow/TrendingNow";
import TrendSpotlight from "@/_Components/home/TrendSpotlight/TrendSpotlight";
import GirlsTrendingSlider from "@/_Components/home/GirlsTrendingSlider/GirlsTrendingSlider";
import ContactSection from "@/_Components/contact/ContactSection";
import TrustFeatures from "@/_Components/home/TrustFeatures/TrustFeatures";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category;
  const category =
    typeof categoryParam === "string" && categoryParam.trim().length > 0
      ? categoryParam.trim()
      : "all";

  return (
    <div className='flex flex-col w-full overflow-x-hidden'>
      {/* 1. Next Direct Signature Hero Campaign: THE GIRLS' SHOP (Dynamic Category Sync) */}
      <HeroBanner activeCategory={category} />

      {/* 2. Next Direct Roundel Row: Shop By Category */}
      <ShopByCategory />

      {/* 3. Next Direct Core Division: Shop By Age */}
      <ShopByAge />

      {/* 4. Next Direct Authentic 3-Card Editorial: TRENDING NOW */}
      <TrendingNow />

      {/* 5. Next Direct "The Edits" Dual Campaign Features */}
      <TrendSpotlight />

      {/* 6. Trending in Girls / Best Sellers Carousel (Dynamic Category Sync) */}
      <GirlsTrendingSlider activeCategory={category} />

      {/* 7. Boutique Contact Us & Customer Care Section */}
      <section className='w-full border-t border-[#EBDED6]/60 dark:border-[#3D332E]/60 bg-[#FAF7F2]/40 dark:bg-[#1F1917]/40 py-10 sm:py-16'>
        <ContactSection embedded={true} />
      </section>

      {/* 8. Value & Trust Guarantee Badges */}
      <TrustFeatures />
    </div>
  );
}
