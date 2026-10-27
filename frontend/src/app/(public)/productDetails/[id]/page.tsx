export const dynamic = 'force-dynamic';

import { GetSpecificProduct } from "@/app/_services/products.services";
import ProductDetailsClientView from "./ProductDetailsClientView";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata, generateProductJsonLd, siteConfig } from "@/config/seo.config";

type ProductDetailsProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductDetailsProps): Promise<Metadata> {
    const { id } = await params;
    const product = await GetSpecificProduct(id);

    if (!product) {
        return constructMetadata({
            title: "Product Not Found",
            description: "The requested luxury girls' product could not be found.",
            noIndex: true,
        });
    }

    const priceText = product.price ? `${product.price} ${siteConfig.currency}` : "";
    const description = product.description 
        ? `${product.description.slice(0, 155)}...` 
        : `Shop ${product.title} from ROAROSA luxury girls collection. ${priceText}. Softness is not weakness.`;

    const image = product.imageCover || (product.images && product.images[0]) || siteConfig.ogImage;

    return constructMetadata({
        title: product.title,
        description,
        image,
        canonicalUrl: `/productDetails/${id}`,
        keywords: [
            product.title,
            product.category?.name || "Girls Fashion",
            "ROAROSA Girls",
            "Luxury Girls Clothes",
            "Girls Occasionwear",
        ],
    });
}

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

    const jsonLd = generateProductJsonLd({
        id: product.id || product._id,
        title: product.title,
        description: product.description,
        price: product.priceAfterDiscount || product.price,
        imageCover: product.imageCover,
        images: product.images,
        category: product.category,
        ratingsAverage: product.ratingsAverage,
        ratingsQuantity: product.ratingsQuantity,
        quantity: product.quantity,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailsClientView product={product} />
        </>
    );
}
