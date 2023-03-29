import { Model, ObjectID } from "@tsed/mongoose";
import { Property, Required } from "@tsed/schema";

@Model()
export class AddressModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  addressLine1: string;

  @Property()
  @Required()
  addressLine2: string;

  @Property()
  @Required()
  state: string;

  @Property()
  @Required()
  country: string;

  @Property()
  @Required()
  city: string;

  @Property()
  @Required()
  pinCode: number;

  @Property()
  @Required()
  phoneNumber: string;
}
