import { Model, MongooseIndexes, ObjectID, Ref } from "@tsed/mongoose";
import { Default, Enum, Property, Required } from "@tsed/schema";
import { SIZES } from "../enums/productEnums";
import { ProductModel } from "./ProductModel";

@Model()
@MongooseIndexes([{ fields: { productId: 1, email: 1 }, options: { unique: 1 } }])
export class CartModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Required()
  @Ref(ProductModel)
  productId: Ref<ProductModel>;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  @Default(1)
  quantity: number;

  @Property()
  @Required()
  @Enum(SIZES)
  size: SIZES;

  @Property()
  @Required()
  color: string;
}
