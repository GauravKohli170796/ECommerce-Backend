import { SIZES } from "../enums/productEnums";

export interface IAddProductRequest{
    name: string;
    description: string;
    price: number;
    category:string;
    quantity: number;
    images?: string[];
    discount?: number;
    productDetails: unknown;
}
export interface IUpdateProductRequest{
    name?: string;
    description?: string;
    price?: number;
    category?:string;
    quantity?: number;
    images?: string[];
    discount?: number;
    productDetails?: unknown;
}

export interface ICartItem {
    productId: string;
    quantity: number;
    color: string;
    size :SIZES
}

export interface IWishListItem {
    productId: string;
}