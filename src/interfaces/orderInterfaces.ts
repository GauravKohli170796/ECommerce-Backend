import { CollectionOf, Email, Enum, Property, Required } from "@tsed/schema";
import { ORDER_STATUS } from "../enums/orderEnum";
import { SIZES } from "../enums/productEnums";

export class IProductDetails {
  @Property()
  @Required()
  productId: string;

  @Property()
  @Required()
  quantity: number;

  @Property()
  @Required()
  price: number;

  @Property()
  @Required()
  color: string;

  @Property()
  @Required()
  @Enum(SIZES)
  size: string;
}

export class IAddOrderRequest {
  @Property()
  @Email()
  email: string;

  @Property()
  @Required()
  addressId: string;

  @Property()
  @Required()
  @CollectionOf(String)
  productIds: Set<string>;

  @Property()
  @Required()
  @CollectionOf(IProductDetails)
  productDetails: Set<IProductDetails>;

  @Property()
  @Enum(ORDER_STATUS)
  orderStatus: ORDER_STATUS;
}

export class IUpdateOrderStatus {
  @Property()
  @Required()
  @Enum(ORDER_STATUS)
  orderStatus: ORDER_STATUS;
}
