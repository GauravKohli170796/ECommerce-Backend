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