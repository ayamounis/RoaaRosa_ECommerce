'use client';
import { Button } from "@/_Components/ui/button";
import FilterByCategories from "../FilterByCategories/FilterByCategories";
import FilterByPriceRange from "../FilterByPriceRange/FilterByPriceRange";
import FilterProductSorting from "../FilterProductSorting/FilterProductSorting";
import { useState } from "react";
import { handleFilter } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type FilterGroupProps = {
  isOpenFilter: boolean;
  setIsOpenFilter: (isOpen: boolean) => void;
  from?: 'lg' | 'sm';
};

const COLOR_SWATCHES = [
  { name: 'Dusty Rose', nameAr: 'وردي مغبر', val: 'dusty-rose', hex: '#C48D80' },
  { name: 'Warm Nude', nameAr: 'بيج دافئ', val: 'warm-nude', hex: '#E5C2AF' },
  { name: 'Taupe', nameAr: 'رمادي داكن', val: 'taupe', hex: '#988172' },
  { name: 'Cream', nameAr: 'كريمي', val: 'cream', hex: '#FBF9F3' },
];

export default function FilterGroup({ isOpenFilter, setIsOpenFilter, from }: FilterGroupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const AGE_OPTIONS = [
    { label: isAr ? 'جميع الأعمار' : 'All Ages', val: null },
    { label: isAr ? 'الرضع (0-2 سنة)' : 'Baby (0-2 Yrs)', val: 'baby' },
    { label: isAr ? 'الصغيرات (3-7 سنوات)' : 'Younger (3-7 Yrs)', val: 'younger' },
    { label: isAr ? 'الكبار (8-12 سنة)' : 'Older (8-12 Yrs)', val: 'older' },
    { label: isAr ? 'المراهقات (13-16 سنة)' : 'Teens (13-16 Yrs)', val: 'teen' },
  ];

  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get('category') || null);
  const [ageGroup, setAgeGroup] = useState<string | null>(searchParams.get('age') || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(searchParams.get('color') || null);
  const [value, setValue] = useState<number[]>([
    Number(searchParams.get('price[gte]')) || 400,
    Number(searchParams.get('price[lte]')) || 3000,
  ]);
  const [sortType, setSortType] = useState<string | null>(searchParams.get('sort') || null);

  const handleApplyFilter = () => {
    const filterQuery = handleFilter(categoryId, sortType, value, ageGroup, selectedColor);
    router.push(`/products?${filterQuery}`);
    if (from !== 'lg') {
      setIsOpenFilter(false);
    }
  };

  const handleResetFilters = () => {
    setCategoryId(null);
    setAgeGroup(null);
    setSelectedColor(null);
    setValue([400, 3000]);
    setSortType(null);
    router.push('/products');
    if (from !== 'lg') {
      setIsOpenFilter(false);
    }
  };

  return (
    <div
      className={`${
        from !== 'lg' ? 'absolute duration-500 p-5 inset-0 bg-[#FBF9F3] dark:bg-[#1F1917] overflow-y-auto' : 'w-full'
      } ${isOpenFilter ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all flex flex-col gap-6 text-[#2B2320] dark:text-[#FAF6F0]`}
    >
      {/* Age Group Filter */}
      <div className='space-y-2'>
        <h3 className='text-sm font-semibold tracking-wider uppercase text-[#2B2320] dark:text-[#FAF6F0]'>
          {isAr ? 'الفئة العمرية' : 'Age Group'}
        </h3>
        <div className='flex flex-wrap gap-1.5 pt-1'>
          {AGE_OPTIONS.map((opt) => (
            <button
              type='button'
              key={opt.label}
              onClick={() => setAgeGroup(opt.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                ageGroup === opt.val
                  ? 'bg-[#C48D80] text-white shadow-2xs'
                  : 'bg-[#F5EFEB] dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#EBDED6]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <FilterByCategories categoryId={categoryId} setCategoryId={setCategoryId} />

      {/* Color Swatches Filter */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold tracking-wider uppercase text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'لوحة ألوان رواروسا' : 'Brand Palette'}
          </h3>
          {selectedColor && (
            <button
              type='button'
              onClick={() => setSelectedColor(null)}
              className='text-xs text-[#C48D80] hover:underline cursor-pointer'
            >
              {isAr ? 'إلغاء' : 'Clear'}
            </button>
          )}
        </div>
        <div className='flex items-center gap-2.5 pt-1'>
          {COLOR_SWATCHES.map((col) => (
            <button
              type='button'
              key={col.val}
              title={isAr ? col.nameAr : col.name}
              onClick={() => setSelectedColor(selectedColor === col.val ? null : col.val)}
              style={{ backgroundColor: col.hex }}
              className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                selectedColor === col.val
                  ? 'ring-2 ring-[#C48D80] ring-offset-2 scale-110 border-[#2B2320]'
                  : 'border-black/20 hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <FilterByPriceRange value={value} setValue={setValue} />

      {/* Sort Type */}
      <FilterProductSorting sortType={sortType} setSortType={setSortType} />

      {/* Action Buttons */}
      <div className='flex flex-col gap-2 pt-2'>
        <Button
          onClick={handleApplyFilter}
          className='w-full py-2.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white font-semibold text-xs tracking-wider uppercase shadow-xs cursor-pointer'
        >
          {isAr ? 'تطبيق التصفية' : 'Apply Filters'}
        </Button>
        <Button
          onClick={handleResetFilters}
          variant='outline'
          className='w-full py-2 rounded-full border-[#EBDED6] dark:border-[#3D332E] text-xs font-medium text-[#988172] hover:text-[#2B2320] cursor-pointer'
        >
          <RotateCcw className='w-3 h-3 mr-1.5' />
          {isAr ? 'إعادة ضبط الكل' : 'Reset All'}
        </Button>
      </div>
    </div>
  );
}
