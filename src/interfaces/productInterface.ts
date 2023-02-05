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
    colors: string[];
    sizes: string[]
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
    colors?: string[];
    sizes?: string []
}

export interface ICartItem {
    productId: string;
    quantity: number;
    color: string;
    size :SIZES
}

export interface ICartUpdateReq {
    quantity: number
}

export interface IWishListItem {
    productId: string;
}

export interface ICategoryReq{
    category: string
}