export interface IProduct {
    sold: number
    images: string[]
    subcategory: ISubcategory[]
    ratingsQuantity: number
    _id: string
    title: string
    slug: string
    description: string
    quantity: number
    price: number
    imageCover: string
    category: ICategory
    brand: IBrand
    ratingsAverage: number
    createdAt: string
    updatedAt: string
    id: string
    count?: number
    priceAfterDiscount?: number
    swatches?: { name: string; hex: string }[]
    ageRangeLabel?: string
    isNewIn?: boolean
    isBestSeller?: boolean
}
export interface ISubcategory {
    _id: string
    name: string
    slug: string
    category: string
}

export interface ICategory {
    _id: string
    name: string
    slug: string
    image: string
}

export interface IBrand {
    _id: string
    name: string
    slug: string
    image: string
}