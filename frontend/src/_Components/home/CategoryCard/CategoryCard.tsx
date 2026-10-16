import Image from 'next/image'
import Link from 'next/link'

type CategoryCardProps = {
    image: string,
    title: string,
    id: string
}
export default function CategoryCard({ image, title, id }: CategoryCardProps) {
    return (
        <Link href={`/products?category[in]=${id}`} className='w-full block min-h-40 sm:h-[200px] relative cursor-pointer group'>
            <Image className='object-cover' fill src={image} alt={title} />
            <span className='absolute text-sm top-0 right-0 bg-button2 text-Bg px-2 rounded-bl-lg'>{title}</span>
        </Link>
    )
}
