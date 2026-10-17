import ProductList from "@/_Components/shared/ProductList/ProductList";
import { GetSpecificCategory } from "@/app/_services/Categories.services";
import { getAllProducts, IProductParams } from "@/app/_services/products.services";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

interface ProductPageProps {
  searchParams: Promise<IProductParams>;
}

export async function generateMetadata({ searchParams }: ProductPageProps): Promise<Metadata> {
  const plainParams: IProductParams = Object.fromEntries(
    Object.entries(await searchParams)
  );
  const Category = await GetSpecificCategory(plainParams?.category || plainParams?.['category[in]'] || '');
  const categoryTitle = Category?.name || "Girls' Clothing";

  return {
    title: `${categoryTitle} | ROAROSA Girls`,
    description: `Shop ROAROSA ${categoryTitle} collection for girls. Softness is not weakness. Free delivery over 1,500 EGP.`
  };
}

export default async function Products({ searchParams }: ProductPageProps) {
  const plainParams: IProductParams = Object.fromEntries(
    Object.entries(await searchParams)
  );

  const products = await getAllProducts(plainParams);
  const Category = await GetSpecificCategory(plainParams?.category || plainParams?.['category[in]'] || '');

  const categoryName = Category?.name || (plainParams.age ? `Girls (${plainParams.age.toUpperCase()})` : "All Girls' Clothing");

  return (
    <div className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container'>
        {/* Next Direct Breadcrumbs */}
        <nav className='flex items-center gap-1.5 text-xs text-[#988172] mb-6'>
          <Link href='/' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
            Home
          </Link>
          <ChevronRight className='w-3 h-3 text-[#988172]/60' />
          <Link href='/products' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
            Girls
          </Link>
          <ChevronRight className='w-3 h-3 text-[#988172]/60' />
          <span className='font-medium text-[#2B2320] dark:text-[#FAF6F0]'>
            {categoryName}
          </span>
        </nav>

        {/* Department Page Header Banner */}
        <div
          data-aos='fade-up'
          className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row sm:items-end justify-between gap-4'
        >
          <div>
            <div className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C48D80] mb-1'>
              <Sparkles className='w-3 h-3' />
              <span>ROAROSA Girls&apos; Department</span>
            </div>
            <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {plainParams.search ? (
                <span>Search: &ldquo;{plainParams.search}&rdquo;</span>
              ) : (
                categoryName
              )}
            </h1>
          </div>

          <p className='text-xs sm:text-sm text-[#988172]'>
            Showing <strong className='text-[#2B2320] dark:text-white'>{products?.length ?? 0}</strong> styles in EGP
          </p>
        </div>

        {/* Products Listing or Empty State */}
        {products && products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className='py-20 text-center max-w-md mx-auto space-y-4'>
            <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
              <Sparkles className='w-8 h-8' />
            </div>
            <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              No styles found
            </h3>
            <p className='text-xs sm:text-sm text-[#988172]'>
              We couldn&apos;t find any girls&apos; clothing items matching your current filters. Try resetting filters or exploring other categories.
            </p>
            <div className='pt-2'>
              <Link
                href='/products'
                className='inline-flex items-center px-6 py-2.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold transition-colors shadow-xs'
              >
                View All Girls&apos; Clothing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
