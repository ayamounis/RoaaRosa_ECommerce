'use client'
import { IProduct } from "@/app/_interfaces/products"
import { useState } from "react"
import FilterGroup from "../FilterGroup/FilterGroup"
import ProductCard from "../ProductCard/ProductCard"
import { SquareChevronUp } from "lucide-react"
import { motion } from 'motion/react'

export default function ProductList({ products }: { products: IProduct[] }) {
    const [isOpenFilter, setIsOpenFilter] = useState(true)
    return (
        <div className="grid grid-cols-4">
            <div className="sticky top-20 px-2 max-md:hidden ">
                <button onClick={() => setIsOpenFilter(!isOpenFilter)} className={` absolute -left-5 ${isOpenFilter ? 'sticky top-28 -ms-10 rotate-270' : ''} rotate-90  md:flex bg-text2 text-primary items-center px-2 py-1 rounded-t-md  border-b-0 active:scale-105 hidden`}>
                    <SquareChevronUp size={20} />
                </button>
                <motion.div initial={{ width: 0 }} exit={{width:0}} transition={{ type: 'spring', stiffness: 200, damping: 20 }} animate={{ width: isOpenFilter ? '100%' : 0 }} className={`${isOpenFilter ? 'sticky top-28 border-r border-muted -mt-5 p-2' : 'hidden'} `}>
                    <FilterGroup isOpenFilter={isOpenFilter} setIsOpenFilter={setIsOpenFilter} from='lg' />
                </motion.div>
            </div>
            <div className={`${isOpenFilter ? 'max-md:col-span-4 col-span-3 sm:grid-cols-2 md:grid-cols-3' : 'col-span-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '} grid grid-cols-1 gap-y-10 `}>
                {
                    products?.map((product: IProduct) => {
                        return <ProductCard key={product.id} product={product} />
                    })
                }
            </div>
        </div>
    )
}
