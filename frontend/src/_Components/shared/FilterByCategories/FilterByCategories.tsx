'use client';
import { ICategory } from "@/app/_interfaces/products";
import { getAllCategories } from "@/app/_services/Categories.services";
import { useEffect, useState } from "react";

export default function FilterByCategories({
  categoryId,
  setCategoryId,
}: {
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
}) {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data ?? []);
    });
  }, []);

  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-semibold tracking-wider text-[#2B2320] dark:text-[#FAF6F0] uppercase'>
        Categories
      </h3>
      <div className='flex flex-wrap gap-1.5 pt-1'>
        <button
          type='button'
          onClick={() => setCategoryId(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            categoryId === null
              ? 'bg-[#C48D80] text-white shadow-2xs'
              : 'bg-[#F5EFEB] dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#EBDED6]'
          }`}
        >
          All Girls
        </button>
        {categories.map((category) => (
          <button
            type='button'
            key={category._id}
            onClick={() => setCategoryId(category.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              categoryId === category.slug || categoryId === category._id
                ? 'bg-[#C48D80] text-white shadow-2xs'
                : 'bg-[#F5EFEB] dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#EBDED6]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
