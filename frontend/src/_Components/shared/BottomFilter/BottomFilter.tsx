'use client';
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import FilterGroup from "../FilterGroup/FilterGroup";
import { usePathname } from "next/navigation";

export default function BottomFilter() {
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const pathname = usePathname();

    if (pathname !== '/products') {
        return null;
    }

    return (
        <div className="lg:hidden">
            {/* Floating Filter Button on Mobile Products Page */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpenFilter(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#2B2320] text-white shadow-xl hover:bg-[#C48D80] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                    <SlidersHorizontal className="w-4 h-4 text-[#E5C2AF]" />
                    <span>Filter & Sort</span>
                </button>
            </div>

            {/* Mobile Filter Modal Sheet */}
            {isOpenFilter && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
                    <div className="w-full max-w-md h-full bg-[#FBF9F3] dark:bg-[#1F1917] p-6 overflow-y-auto flex flex-col">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#2B2320] dark:text-[#FAF6F0]">
                                <SlidersHorizontal className="w-4 h-4 text-[#C48D80]" />
                                <span>Filter & Sort</span>
                            </div>
                            <button
                                onClick={() => setIsOpenFilter(false)}
                                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-[#988172]" />
                            </button>
                        </div>
                        <FilterGroup isOpenFilter={isOpenFilter} setIsOpenFilter={setIsOpenFilter} from="sm" />
                    </div>
                </div>
            )}
        </div>
    );
}
