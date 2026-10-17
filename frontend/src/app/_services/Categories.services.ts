import { ICategory } from "../_interfaces/products";
import { GIRLS_CATEGORIES } from "@/data/girlsCatalog";

export async function getAllCategories(): Promise<ICategory[]> {
    return GIRLS_CATEGORIES
        .filter(cat => cat.id !== 'all')
        .map(cat => ({
            _id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image,
        }));
}

export async function GetSpecificCategory(id: string): Promise<ICategory | null> {
    const found = GIRLS_CATEGORIES.find(c => c.id === id || c.slug === id);
    if (found) {
        return {
            _id: found.id,
            name: found.name,
            slug: found.slug,
            image: found.image,
        };
    }
    return null;
}