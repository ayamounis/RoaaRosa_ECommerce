'use server';
import { IProduct } from "../_interfaces/products";

export interface IProductParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    fields?: string;
    "category[in]"?: string;
}

export async function getAllProducts(params?: IProductParams): Promise<IProduct[] | null> {
    try {
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?${queryString}`, {
            cache: 'no-cache'
        })
        const res = await response.json();
        return res.data
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function GetSpecificProduct(id: string): Promise<IProduct | null> {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            cache: 'no-cache'
        })
        const res = await response.json();
        return res.data
    } catch (error) {
        console.log(error);
        return null
    }
}