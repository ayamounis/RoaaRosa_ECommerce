import { IProduct } from "./products"

export interface IProductCart {
    product: IProduct
    count: number
    price: number
    _id: string
}