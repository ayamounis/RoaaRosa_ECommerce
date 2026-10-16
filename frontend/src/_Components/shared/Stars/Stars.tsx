import { Icons } from "@/_Components/icons/icons";

export default function Stars({ratingsAverage}: {ratingsAverage:number}) {
    return (
        <div className='star flex gap-1 text-rating'>
            {
                Array.from({ length: Math.floor(ratingsAverage) }, (_, i) => (
                    <Icons.star fill='currentColor' color='' className='size-5' key={i} />
                ))
            }
            {
                ratingsAverage % 1 >= 0.5 ?
                    < Icons.halfStar /> : <Icons.star fill='currentColor' color='' className='size-5 text-text2/25' />
            }
            {
                Array.from({ length: 4 - Math.floor(ratingsAverage) }, (_, i) => (
                    <Icons.star key={i} fill='currentColor' color='' className='size-5 text-text2/25' />
                ))
            }
        </div>
    )
}
