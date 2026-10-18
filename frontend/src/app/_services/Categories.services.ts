import { ICategory } from "../_interfaces/products";
import { GIRLS_CATEGORIES } from "@/data/girlsCatalog";
import { API_BASE_URL } from "@/utils/apiConfig";

export async function getAllCategories(): Promise<ICategory[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            cache: 'force-cache'
        });
        if (response.ok) {
            const finalRes = await response.json();
            if (finalRes?.data && Array.isArray(finalRes.data) && finalRes.data.length > 0) {
                return finalRes.data;
            }
        }
    } catch {
        // Fall back to local catalog
    }

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
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            cache: 'no-cache'
        });
        if (response.ok) {
            const finalRes = await response.json();
            if (finalRes?.data) {
                return finalRes.data;
            }
        }
    } catch {
        // Fall back to local catalog
    }

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