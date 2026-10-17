export type ProductCardProps = {
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    id: string;
    _id?: string;
    category?: { name: string; slug?: string };
    ageRangeLabel?: string;
    swatches?: { name: string; hex: string }[];
    isNewIn?: boolean;
};