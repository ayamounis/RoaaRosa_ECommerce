import React from "react";

export interface FilterProductSortingProps {
  sortType: string | null;
  setSortType: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function FilterProductSorting({
  sortType,
  setSortType,
}: FilterProductSortingProps) {
  const options = [
    { label: "New In", val: "-createdAt" },
    { label: "Price: Low to High", val: "price" },
    { label: "Price: High to Low", val: "-price" },
    { label: "Top Rated", val: "-ratingsAverage" },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold tracking-wider text-[#2B2320] dark:text-[#FAF6F0] uppercase'>
          Sort By
        </h3>
        {sortType != null && (
          <button
            type='button'
            onClick={() => setSortType(null)}
            className='text-xs text-[#C48D80] hover:underline cursor-pointer'
          >
            Clear Sort
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-1.5 pt-1'>
        {options.map((opt) => (
          <button
            type='button'
            key={opt.val}
            onClick={() => setSortType(sortType === opt.val ? null : opt.val)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
              sortType === opt.val
                ? "bg-[#C48D80] text-white shadow-2xs"
                : "bg-[#F5EFEB] dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#EBDED6]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
