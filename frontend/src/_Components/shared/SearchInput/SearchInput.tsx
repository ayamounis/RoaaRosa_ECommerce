'use client';
import { Icons } from '@/_Components/icons/icons';
import { Input } from '@/_Components/ui/input';
import { IProduct } from '@/app/_interfaces/products';
import { getAllProducts } from '@/app/_services/products.services';
import { X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation';

export type SearchInputProps = {
    searchKeyword?: string;
    setSearchKeyword?: (keyword: string) => void;
};
export default function SearchInput({ searchKeyword, setSearchKeyword }: SearchInputProps) {
    const [products, setProducts] = useState<IProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setIsOpen(true);
        setSearchKeyword?.(e.currentTarget.value);
        const value = e.currentTarget.value;
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filteredProducts);
        if (e.currentTarget.value === '') {
            setIsOpen(false);
            console.log('close');
        }
    }
    const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        setIsOpen(false);
        router.push(`/products?search=${encodeURIComponent(searchKeyword || e.currentTarget.value)}`);
        console.log(searchKeyword);
    }

    useEffect(() => {
        getAllProducts().then((res) => setProducts(res ?? []))
    }, [])

    return (
        <span className='relative'>
            <Input
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSubmit(e) } }}
                onInput={handleInput} type='search' className='w-full ps-8 bg-secondary shadow-none border-none' placeholder='Search for products' />
            <Icons.search size={20} className='absolute top-1/2 left-2 -translate-y-1/2' />
            <motion.div initial={{ height: 0 }} transition={{ type: 'spring', stiffness: 200, mass: 0.4 }} animate={{ height: isOpen ? 'auto' : 0 }}
                className={`absolute md:top-10 md:min-w-110 max-sm:bottom-10 left-0  min-w-70 w-full bg-text dark:bg-secondary shadow-md mt-2 rounded-md z-10 overflow-y-auto max-h-80 ${isOpen ? 'h-auto' : 'h-0'}`}>
                {/* close Search */}
                <span onClick={() => setIsOpen(false)} className='flex justify-between items-center border-b px-2 py-1 cursor-pointer'><span>Search Engine</span><X /></span>
                {/* Render search results here */}
                {filteredProducts.slice(0, 10).map(product => (
                    <Link href={`/productDetails/${product._id}`} key={product._id} className='px-4 block hover:bg-secondary2 cursor-pointer border-b last:border-0 py-3 active:scale-105 transition-all' onClick={() => setIsOpen(false)}>
                        <div className='flex items-center gap-4'>
                            <h3 className='filterBtn !active:bg-secondary flex-1 text-center'>{product.category.name}</h3>
                            <h1 className='font-medium flex-2 text-center'>{product.title.split(' ').slice(0, 4).join(' ')}</h1>
                            <h2 className='button-primary rounded-2xl p-1 text-xs flex-1 text-center'>{product.brand.name}</h2>
                        </div>
                    </Link >
                ))}
            </motion.div>
        </span>
    )
}
