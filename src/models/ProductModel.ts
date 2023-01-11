import { Model, ObjectID } from "@tsed/mongoose";
import { Default, Max, Min, Property, Required } from "@tsed/schema";

@Model()
export class ProductModel {
  @ObjectID("_id")
  _id: string;

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
  category: string; //it need to changed in future , make it enum here

  @Property()
  @Required()
  quantity: number;

  @Property()
  @Default(new Date)
  createdAt: Date;

  @Property()
  @Default(new Date)
  updatedAt: Date;

  @Property()
  @Default(["https://source.unsplash.com/720x600/?cloth"])
  images: string[];

  @Property()
  @Max(100)
  @Min(0)
  @Default(0)
  discount: number;


  @Property()
  @Required()  
  productDetails: Record<string, unknown>;

}
