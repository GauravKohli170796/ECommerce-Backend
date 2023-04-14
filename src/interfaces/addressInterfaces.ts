import { Property, Required } from "@tsed/schema";
export class IAddressInfo {
  @Property()
  @Required()
  addressLine1: string;

  @Property()
  @Required()
  addressLine2: string;

  @Property()
  @Required()
  pinCode: number;

  @Property()
  @Required()
  phoneNumber: string;

  @Property()
  @Required()
  city: string;

  @Property()
  @Required()
  country: string;

  @Property()
  @Required()
  state: string;

  @Property()
  @Required()
  email: string;
}
