'use client'
import { ICategory } from "@/app/_interfaces/products";
import { getAllCategories } from "@/app/_services/Categories.services";
import { useEffect, useState } from "react";

export default function FilterByCategories({ categoryId, setCategoryId }: { categoryId: string | null, setCategoryId: (id: string | null) => void }) {
    const [categories, setcategories] = useState<ICategory[]>([])
    useEffect(() => {
        getAllCategories().then((data) => {
            setcategories(data ?? [])
        })
    }, [])

    return (
        <div>
            <h3 className="!text-lg font-medium">Filter By Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                <span onClick={() => setCategoryId(null)} className={`filterBtn font-medium ${categoryId === null ? '!bg-secondary2 !text-text' : ''}`}>
                    All Categories
                </span>
                {categories.map((category) => (
                    <span onClick={() => setCategoryId(category._id)} key={category._id} className={`filterBtn font-medium ${categoryId === category._id ? '!bg-secondary2 !text-text' : ''}`}>
                        {category.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
