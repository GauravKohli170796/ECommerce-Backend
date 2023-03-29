import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Default, Enum, Property, Required } from "@tsed/schema";
import { ORDER_STATUS } from "../enums/orderEnum";
import { IProductDetails } from "../interfaces/orderInterfaces";
import { AddressModel } from "./AddressModel";
import { ProductModel } from "./ProductModel";

@Model()
export class OrderModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  @Ref(AddressModel)
  addressId: Ref<AddressModel>;

  @Property()
  @Required()
  @Ref(ProductModel)
  productIds: Ref<ProductModel>[];

  @Property()
  @Required()
  productDetails: IProductDetails[];

  @Property()
  @Required()
  @Enum(ORDER_STATUS)
  @Default(ORDER_STATUS.NotAccepted)
  orderStatus: ORDER_STATUS;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;
}
