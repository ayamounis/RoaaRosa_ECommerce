'use client';
import { ICategory } from "@/app/_interfaces/products";
import { getAllCategories } from "@/app/_services/Categories.services";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORY_AR_NAMES: Record<string, string> = {
  'dresses': 'فساتين وأطقم',
  'tops': 'بلوزات وتيشيرتات',
  'knitwear': 'صوف وتريكو',
  'coats': 'معاطف وجواكت',
  'sets': 'أطقم وتنسيقات',
  'nightwear': 'ملابس نوم وبيجامات',
  'occasions': 'مناسبات وسهرات',
  'shoes': 'أحذية',
};

export default function FilterByCategories({
  categoryId,
  setCategoryId,
}: {
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
}) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    getAllCategories().then((data) => {
      // Exclude shoes from categories list
      const clean = (data ?? []).filter(
        (c) => (c.slug || '').toLowerCase() !== 'shoes' && (c.name || '').toLowerCase() !== 'shoes'
      );
      setCategories(clean);
    });
  }, []);

  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-semibold tracking-wider text-[#2B2320] dark:text-[#FAF6F0] uppercase'>
        {isAr ? 'الأقسام والفئات' : 'Categories'}
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
          {isAr ? 'كل التشكيلات' : 'All Girls'}
        </button>
        {categories.map((category) => {
          const slug = (category.slug || '').toLowerCase();
          const displayName = isAr
            ? CATEGORY_AR_NAMES[slug] || category.name
            : category.name;

          return (
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
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
