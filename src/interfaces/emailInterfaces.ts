import { Email, Enum, MaxLength, MinLength, Property, Required } from "@tsed/schema";

export enum EmailTypes {
  SIGNUP = "SIGNUP",
  FORGET_PASSWORD = "FORGET_PASSWORD"
}
export class IEmailBody {
  @Property()
  @Required()
  @MinLength(4)
  @MaxLength(4)
  otp: string;

  @Property()
  @Required()
  @Enum(EmailTypes)
  type: string;

  @Property()
  @Required()
  @Email()
  email: string;
}
