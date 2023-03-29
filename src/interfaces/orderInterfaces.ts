import { ORDER_STATUS } from "../enums/orderEnum";
import { SIZES } from "../enums/productEnums";

export interface IProductDetails {
  productId: string;
  quantity: number;
  price: number;
  color: string;
  size: SIZES;
}

export interface IAddOrderRequest {
  email: string;
  addressId: string;
  productIds: string[];
  productDetails: IProductDetails[];
  orderStatus?: ORDER_STATUS;
}

export interface IUpdateOrderStatus {
  orderStatus: ORDER_STATUS;
}
