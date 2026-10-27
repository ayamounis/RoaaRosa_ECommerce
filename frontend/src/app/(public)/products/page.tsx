export const dynamic = 'force-dynamic';

import ProductList from "@/_Components/shared/ProductList/ProductList";
import { GetSpecificCategory } from "@/app/_services/Categories.services";
import { getAllProducts, IProductParams } from "@/app/_services/products.services";
import { Metadata } from "next";
import ProductsHeader from "./ProductsHeader";
import ProductsEmptyState from "./ProductsEmptyState";

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
        <ProductsHeader
          categorySlug={plainParams.category as string}
          categoryNameEn={categoryName}
          age={plainParams.age as string}
          search={plainParams.search as string}
          productCount={products?.length ?? 0}
        />

        {/* Products Listing or Empty State */}
        {products && products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <ProductsEmptyState />
        )}
      </div>
    </div>
  );
}
