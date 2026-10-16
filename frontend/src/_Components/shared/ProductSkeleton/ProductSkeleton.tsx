import { Skeleton } from '@/_Components/ui/skeleton'
import React from 'react'

export default function ProductSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="sm:w-[270px] w-full h-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}
