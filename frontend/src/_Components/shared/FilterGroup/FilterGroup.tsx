'use client';
import { Button } from "@/_Components/ui/button";
import FilterByCategories from "../FilterByCategories/FilterByCategories";
import FilterByPriceRange from "../FilterByPriceRange/FilterByPriceRange";
import FilterProductSorting, { FilterProductSortingProps } from "../FilterProductSorting/FilterProductSorting";
import { useState } from "react";
import { ICategory } from "@/app/_interfaces/products";
import { handleFilter } from "@/lib/utils";
import { useRouter } from "next/navigation";

type FilterGroupProps = {
    isOpenFilter: boolean;
    setIsOpenFilter: (isOpen: boolean) => void;
    from?: 'lg' | 'sm';
}
export default function FilterGroup({ isOpenFilter, setIsOpenFilter, from }: FilterGroupProps) {
    const route = useRouter()
    const [categoryId, setCategoryId] = useState<ICategory['_id'] | null>(null)
    const [value, setValue] = useState([100, 50000])
    const [sortType, setSortType] = useState<FilterProductSortingProps['sortType']>(null)

    const handleApplyFilter = () => {
        const filterUrl = handleFilter(categoryId, sortType, value);
        route.push(`/products?${filterUrl}`);
        setIsOpenFilter(false);
    }
    return (
        <div className={`${from !== 'lg' ? 'absolute duration-1000 p-5 inset-0' : 'w-full'} ${isOpenFilter ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all flex flex-col gap-4`}>
            <FilterByCategories categoryId={categoryId} setCategoryId={setCategoryId} />
            <FilterByPriceRange value={value} setValue={setValue} />
            <FilterProductSorting sortType={sortType} setSortType={setSortType} />
            <Button onClick={() => handleApplyFilter()} className="button-primary">Apply Filter</Button>
        </div>
    )
}
