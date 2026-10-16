import { ICategory } from "../_interfaces/products";

export async function getAllCategories(): Promise<ICategory[] | null> {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
            cache: 'force-cache'
        })
        const finalRes = await response.json()
        // !filter the categories to get only the 3 categories we need (men's-fashion, women's-fashion, electronics)
        const allClearCagegories = finalRes.data
        return allClearCagegories.filter((category: ICategory) => category.slug == `men's-fashion`||category.slug == `women's-fashion`||category.slug == `electronics`)
        
    } catch (error) {
        console.log(error);
        return null
    }
}
export async function GetSpecificCategory(id: string): Promise<ICategory | null> {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`, {
            cache: 'no-cache'
        })
        const finalRes = await response.json()
        return finalRes.data
    } catch (error) {
        console.log(error);
        return null
    }
}