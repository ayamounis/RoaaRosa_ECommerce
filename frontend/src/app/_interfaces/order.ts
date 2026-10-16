import { IProduct } from "./products"

export interface IOrder {
    shippingAddress?: IShippingAddress
    taxPrice: number
    shippingPrice: number
    totalOrderPrice: number
    paymentMethodType: string
    isPaid: boolean
    isDelivered: boolean
    _id: string
    user: IUser
    cartItems: ICartItem[]
    createdAt: string
    updatedAt: string
    id: number
    __v: number
    paidAt?: string
}
export interface IShippingAddress {
    details: string
    city: string
    phone?: string
    postalCode?: string
}
export interface IUser {
    _id: string
    name: string
    email: string
    phone: string
}
export interface ICartItem {
    count: number
    product: IProduct
    price: number
    _id: string
}