import { Skeleton } from '@/_Components/ui/skeleton'
import React from 'react'

export default function SliderSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="w-full h-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}
