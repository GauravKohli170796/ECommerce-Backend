import { Model, ObjectID } from "@tsed/mongoose";
import { Property, Required } from "@tsed/schema";

@Model()
export class CategoryModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  categories: string[];
}
