'use client';
import { SquareChevronUp } from "lucide-react";
import { motion } from 'motion/react';
import { useState } from "react";
import FilterGroup from "../FilterGroup/FilterGroup";
import SearchInput from "../SearchInput/SearchInput";
import { useRouter } from "next/navigation";

export default function BottomFilter() {
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState('')
    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push(`/products?search=${encodeURIComponent(searchKeyword)}`);
    }
    return (
        <motion.div transition={{ type: 'spring', stiffness: 500 }} animate={{ height: isOpenFilter ? 450 : 55 }} className={`md:hidden fixed z-10 transition-all flex items-end bg-Bg ${isOpenFilter ? '!bg-gradient-to-b from-secondary1 to-Bg' : ''} bottom-0 right-0 left-0 w-full px-4 py-2  border border-muted rounded-md shadow-md`}>
            <motion.button initial={{y:0}} transition={{type:'spring',stiffness:400 ,mass:0.4, duration:10,delay:2,repeat:Infinity}} animate={{y:isOpenFilter?0:-5}} onClick={() => setIsOpenFilter(!isOpenFilter)} className=" absolute bottom-full right-0 flex bg-text2 text-primary items-center px-2 py-1 rounded-t-md  border-b-0 active:scale-105">
                <SquareChevronUp size={20} />
            </motion.button>
            <FilterGroup isOpenFilter={isOpenFilter} setIsOpenFilter={setIsOpenFilter} />
            <form className="flex items-center gap-2 w-full">
                <div className="!text-xs font-medium flex-3">
                    <SearchInput searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} />
                </div>
                <button type="submit" onClick={handleSubmit} className="button-primary py-2 px-2 flex-center rounded-md text-sm flex-1">
                    Search
                </button>
            </form>
        </motion.div>
    )
}
