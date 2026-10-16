import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates filter URL based on selected filters
 * @param categoryId Category ID to filter by
 * @param sortType Sort type to apply
 * @param value [minPrice, maxPrice] Price range to filter by
 * @returns filterUrl
 */
export const handleFilter = (categoryId: string | null, sortType: string | null, value: number[]) => {
        let filterUrl = ''
        if (categoryId) {
            filterUrl += `category[in]=${categoryId}&`
        }
        if (sortType) {
            filterUrl += `sort=${sortType}&`
        }
        filterUrl += `price[gte]=${value[0]}&price[lte]=${value[1]}`
        return filterUrl;
    }

