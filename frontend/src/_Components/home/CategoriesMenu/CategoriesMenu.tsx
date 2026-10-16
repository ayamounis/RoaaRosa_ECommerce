import { getAllCategories } from '@/app/_services/Categories.services';
import Link from 'next/link';

export default async function CategoriesMenu() {
    const categories = await getAllCategories();
    return (
        <div className='w-1/4 border-r hidden md:block'>
            <div className="flex flex-col gap-4 justify-between pt-10">
                {categories && categories.map(({ name, _id }, i) => (
                    <Link className='navbarLink w-fit' key={i} href={`/products?category[in]=${_id}`}>{name}</Link>
                ))}
            </div>
        </div>
    )
}
