import { Model, MongooseIndexes, ObjectID, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/schema";
import { ProductModel } from "./ProductModel";

@Model()
@MongooseIndexes([{ fields: { productId: 1, email: 1 }, options: { unique: 1 } }])
export class WishListModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Required()
  @Ref(ProductModel)
  productId: Ref<ProductModel>;

  @Property()
  @Required()
  email: string;
}
