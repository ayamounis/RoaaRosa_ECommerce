'use server';
import { IProduct } from "../_interfaces/products";
import { GIRLS_PRODUCTS, IGirlsProduct } from "@/data/girlsCatalog";

export interface IProductParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    fields?: string;
    "category[in]"?: string;
    category?: string;
    age?: string;
    ageGroup?: string;
    color?: string;
    "price[gte]"?: string | number;
    "price[lte]"?: string | number;
}

export async function getAllProducts(params?: IProductParams): Promise<IProduct[]> {
    try {
        let results: IGirlsProduct[] = [...GIRLS_PRODUCTS];

        if (!params) {
            return results;
        }

        // Filter by Category
        const catFilter = params.category || params["category[in]"];
        if (catFilter && catFilter !== 'all') {
            const normalizedCat = catFilter.toLowerCase();
            results = results.filter(p => 
                p.category.slug.toLowerCase() === normalizedCat || 
                p.category._id.toLowerCase() === normalizedCat ||
                p.category.name.toLowerCase().includes(normalizedCat)
            );
        }

        // Filter by Age Group
        const ageFilter = params.age || params.ageGroup;
        if (ageFilter && ageFilter !== 'all') {
            const normalizedAge = ageFilter.toLowerCase();
            results = results.filter(p => p.ageGroup.toLowerCase() === normalizedAge);
        }

        // Filter by Search Query
        if (params.search) {
            const q = params.search.toLowerCase().trim();
            results = results.filter(p => 
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.name.toLowerCase().includes(q) ||
                p.ageRangeLabel.toLowerCase().includes(q)
            );
        }

        // Filter by Price Range
        if (params["price[gte]"] !== undefined) {
            const min = Number(params["price[gte]"]);
            if (!isNaN(min)) {
                results = results.filter(p => (p.priceAfterDiscount ?? p.price) >= min);
            }
        }
        if (params["price[lte]"] !== undefined) {
            const max = Number(params["price[lte]"]);
            if (!isNaN(max)) {
                results = results.filter(p => (p.priceAfterDiscount ?? p.price) <= max);
            }
        }

        // Filter by Color
        if (params.color) {
            const col = params.color.toLowerCase();
            results = results.filter(p => 
                p.swatches.some(s => s.name.toLowerCase().includes(col))
            );
        }

        // Sort
        if (params.sort) {
            if (params.sort === 'price' || params.sort === 'price-asc') {
                results.sort((a, b) => (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price));
            } else if (params.sort === '-price' || params.sort === 'price-desc') {
                results.sort((a, b) => (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price));
            } else if (params.sort === '-createdAt' || params.sort === 'newest') {
                results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } else if (params.sort === '-ratingsAverage' || params.sort === 'rating') {
                results.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [...GIRLS_PRODUCTS];
    }
}

export async function GetSpecificProduct(id: string): Promise<IProduct | null> {
    try {
        const local = GIRLS_PRODUCTS.find(p => p.id === id || p._id === id);
        if (local) {
            return local;
        }

        // Fallback for legacy items if any
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            cache: 'no-cache'
        });
        const res = await response.json();
        return res.data ?? null;
    } catch (error) {
        console.error("Error fetching specific product:", error);
        return null;
    }
}