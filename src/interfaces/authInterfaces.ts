import { Email, Enum, Property, Required } from "@tsed/schema";
import { ROLES } from "../enums/authEnum";

export class IJwtTokens {
  @Property()
  @Required()
  accessToken: string;

  @Property()
  @Required()
  refreshToken: string;
}
export class ILoginRequest {
  @Property()
  @Required()
  @Email()
  email: string;

  @Property()
  @Required()
  password: string;
}
export class IGoogleAuthRequest {
  @Property()
  @Required()
  @Email()
  email: string;

  @Property()
  @Required()
  name: string;
}

export class ISignUpRequest {
  @Property()
  @Required()
  @Email()
  email: string;

  @Property()
  @Required()
  password: string;

  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  phoneNumber: string;
}

export class ITokenPayload {
  @Property()
  @Required()
  @Email()
  email: string;

  @Property()
  @Required()
  @Enum(ROLES)
  role: ROLES;

  @Property()
  iat?: number;
}
