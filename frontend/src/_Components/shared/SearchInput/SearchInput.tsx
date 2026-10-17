'use client';
import { Input } from '@/_Components/ui/input';
import { IProduct } from '@/app/_interfaces/products';
import { getAllProducts } from '@/app/_services/products.services';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export type SearchInputProps = {
    searchKeyword?: string;
    setSearchKeyword?: (keyword: string) => void;
};

export default function SearchInput({ searchKeyword, setSearchKeyword }: SearchInputProps) {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setSearchKeyword?.(value);
        if (value.trim() === '') {
            setIsOpen(false);
            setFilteredProducts([]);
            return;
        }
        setIsOpen(true);
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(value.toLowerCase()) ||
            product.category.name.toLowerCase().includes(value.toLowerCase()) ||
            product.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsOpen(false);
            const term = (e.currentTarget.value || searchKeyword || '').trim();
            if (term) {
                router.push(`/products?search=${encodeURIComponent(term)}`);
            }
        }
    };

    useEffect(() => {
        getAllProducts().then((res) => setProducts(res ?? []));
    }, []);

    return (
        <div className='relative w-full max-w-xl'>
            <div className='relative flex items-center'>
                <Input
                    onKeyDown={handleSubmit}
                    onInput={handleInput}
                    type='search'
                    className='w-full pl-10 pr-4 py-2.5 h-11 text-sm bg-[#FAF7F2] dark:bg-[#2D2623] border border-[#EBDED6] dark:border-[#3D332E] rounded-full shadow-xs focus-visible:ring-1 focus-visible:ring-[#C48D80] placeholder:text-[#988172]/70 text-[#2B2320] dark:text-[#FAF6F0]'
                    placeholder="Search for girls' dresses, coats, shoes, pyjamas..."
                />
                <Search size={18} className='absolute left-3.5 text-[#988172]' />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -5 }}
                className={`absolute top-12 left-0 right-0 bg-white dark:bg-[#28211E] shadow-xl border border-[#EBDED6] dark:border-[#3D332E] rounded-xl z-50 overflow-hidden max-h-96 ${isOpen ? 'block' : 'hidden'}`}
            >
                <div className='flex justify-between items-center px-4 py-2.5 bg-[#FAF7F2] dark:bg-[#2D2623] border-b border-[#EBDED6] dark:border-[#3D332E] text-xs font-medium text-[#988172]'>
                    <span>Girls&apos; Collection Results ({filteredProducts.length})</span>
                    <button onClick={() => setIsOpen(false)} className='hover:text-[#2B2320] dark:hover:text-white'>
                        <X size={15} />
                    </button>
                </div>

                <div className='overflow-y-auto max-h-80 divide-y divide-[#EBDED6]/50 dark:divide-[#3D332E]'>
                    {filteredProducts.slice(0, 8).map(product => (
                        <Link
                            href={`/productDetails/${product._id}`}
                            key={product._id}
                            className='flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF7F2] dark:hover:bg-[#2D2623] transition-colors'
                            onClick={() => setIsOpen(false)}
                        >
                            <div className='relative w-12 h-14 rounded overflow-hidden bg-[#FAF7F2] flex-shrink-0'>
                                <Image
                                    src={product.imageCover}
                                    alt={product.title}
                                    fill
                                    className='object-cover'
                                    sizes='48px'
                                />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-[#988172] uppercase tracking-wider'>{product.category.name}</p>
                                <p className='text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0] truncate'>{product.title}</p>
                            </div>
                            <div className='text-right'>
                                <span className='text-sm font-semibold text-[#C48D80]'>
                                    {product.priceAfterDiscount ?? product.price} EGP
                                </span>
                            </div>
                        </Link>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className='p-6 text-center text-sm text-[#988172]'>
                            No girls&apos; clothing items found. Try searching &quot;dress&quot;, &quot;coat&quot;, or &quot;rose&quot;.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
