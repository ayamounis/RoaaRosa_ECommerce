import { IProduct } from "./products"

export interface IWishlistItem {
    status: string
    count: number
    data: IProduct[]
}