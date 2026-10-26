export const dynamic = "force-dynamic";

import { getUserCart } from "@/app/_services/cart.services";
import { IProduct } from "@/app/_interfaces/products";
import CartContent from "./CartContent";

export type ItemType = {
  count: number;
  _id: string;
  price: number;
  product: IProduct;
};

export default async function Cart() {
  const cartRes = await getUserCart();
  const products = cartRes?.data?.products ?? [];
  const totalCartPrice = cartRes?.data?.totalCartPrice ?? 0;

  return (
    <CartContent
      initialProducts={products}
      initialTotalPrice={totalCartPrice}
    />
  );
}
