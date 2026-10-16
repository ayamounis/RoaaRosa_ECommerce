import { ICartItem, IOrder } from "@/app/_interfaces/order";
import moment from 'moment';
import Image from "next/image";

export default function OrderCard({ order }: { order: IOrder }) {
    const { cartItems, createdAt, shippingPrice, totalOrderPrice, paymentMethodType, isPaid, shippingAddress,id } = order;
    return (
        <div className="orderCard pt-8 px-8 pb-4 bg-Bg rounded-2xl border-s-4 border-secondary2 shadow">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-medium text-text2">Order <span className="text-hover-button2 text-lg "> #{id} </span></h2>
                {isPaid ?
                    <span className="flex-center text-xs px-2 py-1 font-medium text-green-800 bg-green-200  rounded-2xl">Paid</span> :
                    <span className="flex-center text-xs px-2 py-1 font-medium text-text bg-secondary2  rounded-2xl">Not Paid</span>
                }
            </div>
            <div className="flex w-full justify-between">
                <div className="flex flex-col gap-1.5 mt-4">
                    <p className="text-text2/80 text-sm font-medium">Total: <span className="text-text1">{totalOrderPrice} EGP</span></p>
                    <p className="text-text2/80 text-sm font-medium">Shipping: <span className="text-text1">{shippingPrice} EGP</span></p>
                    <p className="text-text2/80 text-sm font-medium">Payment Method: <span className="text-text1">{paymentMethodType} </span></p>
                </div>
                {shippingAddress &&
                    <div className="flex flex-col gap-1.5 mt-4">
                        <h2 className="text-text2/80 text-sm font-medium">Shipping Address</h2>
                        <p className="text-text1 text-sm font-medium"> {shippingAddress?.city} - {shippingAddress?.details}</p>
                    </div>
                }
            </div>
            <div className="mt-4 text-start flex flex-col gap-4 ms-auto w-full max-h-30 overflow-y-scroll ">
                {
                    cartItems.map((item: ICartItem) => (
                        <div key={item.product._id} className="p-2 bg-secondary1 rounded-2xl flex gap-4 border-s-2 ">
                            <Image src={item.product.imageCover} alt={item.product.title} className="object-contain rounded-2xl" width={40} height={40} />
                            <div className="details text-sm">
                                <h2 className="title font-semibold text-text2">{item.product.title}</h2>
                                <p className="title text-text1 font-medium">Qty: {item.count}  |  Price: {item.price} EGP</p>
                            </div>
                        </div>
                    ))
                }

            </div>
            <p className="text-text1 text-xs font-medium text-end mt-4">ordered on: {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}.</p>
        </div>
    )
}