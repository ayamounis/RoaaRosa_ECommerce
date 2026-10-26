import { GetSpecificProduct } from "@/app/_services/products.services";
import ProductDetailsClientView from "./ProductDetailsClientView";
import Link from "next/link";

type ProductDetailsProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductDetails({ params }: ProductDetailsProps) {
    const { id } = await params;
    const product = await GetSpecificProduct(id);

    if (!product) {
        return (
            <div className='container py-24 text-center'>
                <h2 className='font-serif text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mb-4'>
                    Product Not Found / لم يتم العثور على المنتج
                </h2>
                <Link
                    href='/products'
                    className='inline-flex items-center px-6 py-2.5 rounded-full bg-[#C48D80] text-white text-xs font-semibold'
                >
                    Back to Girls&apos; Collection / العودة لتشكيلة البنات
                </Link>
            </div>
        );
    }

    return <ProductDetailsClientView product={product} />;
}
