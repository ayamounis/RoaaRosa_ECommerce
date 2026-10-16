import ProductList from "@/_Components/shared/ProductList/ProductList";
import { GetSpecificCategory } from "@/app/_services/Categories.services";
import { getAllProducts, IProductParams } from "@/app/_services/products.services";
import { Metadata } from "next";
interface ProductPageProps {
  searchParams: Promise<IProductParams>
}
export async function generateMetadata({ searchParams }: ProductPageProps): Promise<Metadata> {
  const plainParams: IProductParams = Object.fromEntries(
    Object.entries(await searchParams)
  )
  const Category = await GetSpecificCategory(plainParams?.['category[in]'] || '');
  const category = Category?.name || "All";

  return {
    title: `${category} Products `
  };
}
export default async function Products({ searchParams }: ProductPageProps) {
  const plainParams: IProductParams = Object.fromEntries(
    Object.entries(await searchParams)
  )
  const { search, ...apiParams } = plainParams
  const products = await getAllProducts(apiParams);
  const Category = await GetSpecificCategory(apiParams?.['category[in]'] || '');

  if (products?.length === 0 || !products) {
    return <p className="h-screen text-center text-5xl font-bold my-10">No Products Found</p>;
  }

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filteredProducts?.length === 0) {
    return <p className="h-screen text-center text-5xl font-bold my-10">{`No Products Found for "${search}"`}</p>;
  }

  return (
    <section>
      <div className=" sm:text-5xl text-4xl font-bold my-10">
        {search ?
          <div className="text-start">
            <span className="sr-only">Search result:</span>
            <span className="text-button2 ">{`Result of searching`} </span>
            <span className="text-text2 ">{`"${search}"`}</span>
          </div>
          :
          <div className="text-center">
            <span className="text-button2">{Category?.name || 'All'} </span>
            <span>Products</span>
          </div>
        }
      </div>
      <div className="min-h-screen ">
        <ProductList products={filteredProducts} />
      </div>
    </section>

  )
}
