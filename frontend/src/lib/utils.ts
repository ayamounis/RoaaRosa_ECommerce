import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates filter URL query string based on selected filters
 */
export const handleFilter = (
  categoryId: string | null,
  sortType: string | null,
  value: number[],
  ageGroup?: string | null,
  color?: string | null
) => {
  const params = new URLSearchParams();
  if (categoryId && categoryId !== 'all') {
    params.set('category', categoryId);
  }
  if (ageGroup && ageGroup !== 'all') {
    params.set('age', ageGroup);
  }
  if (color) {
    params.set('color', color);
  }
  if (sortType) {
    params.set('sort', sortType);
  }
  if (value && value.length === 2) {
    params.set('price[gte]', value[0].toString());
    params.set('price[lte]', value[1].toString());
  }
  return params.toString();
};
