import { Model, ObjectID, Unique } from "@tsed/mongoose";
import { Default, Property, Required } from "@tsed/schema";
import { ROLES } from "../enums/authEnum";

@Model()
export class UserModel {
  @ObjectID("id")
  id: string;

  @Property()
  name: string;

  @Property()
  @Required()
  @Unique()
  email: string;

  @Property()
  password: string;

  @Property()
  phoneNumber: string;

  @Property()
  @Required()
  isGoogleAuth: boolean;

  @Property()
  @Required()
  @Default(ROLES.USER)
  role : ROLES
}