import { CollectionOf, Enum, Property, Required } from "@tsed/schema";
import { SIZES } from "../enums/productEnums";

export class IAddProductRequest {
  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  description: string;

  @Property()
  @Required()
  price: number;

  @Property()
  @Required()
  category: string;

  @Property()
  @Required()
  quantity: number;

  @Property()
  @Required()
  @CollectionOf(String)
  images: string[];

  @Property()
  @Required()
  discount?: number;

  @Property()
  @Required()
  productDetails: unknown;

  @Property()
  @Required()
  colors: string[];

  @Property()
  @Required()
  @Enum(SIZES)
  sizes: Set<string>;
}
export class IUpdateProductRequest {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  price: number;

  @Property()
  category: string;

  @Property()
  quantity: number;

  @Property()
  images?: string[];

  @Property()
  discount?: number;

  @Property()
  productDetails?: unknown;

  @Property()
  colors?: string[];

  @Property()
  @Enum(SIZES)
  sizes?: SIZES[];
}

export class ICartItem {
  @Property()
  @Required()
  productId: string;

  @Property()
  @Required()
  quantity: number;

  @Property()
  @Required()
  color: string;

  @Property()
  @Required()
  @Enum(SIZES)
  size: SIZES;
}

export class ICartUpdateReq {
  @Property()
  @Required()
  quantity: number;
}

export class IWishListItem {
  @Property()
  @Required()
  productId: string;
}

export class ICategoryReq {
  @Property()
  @Required()
  category: string;
}
