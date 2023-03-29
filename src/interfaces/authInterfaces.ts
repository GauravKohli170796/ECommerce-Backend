import { ROLES } from "../enums/authEnum";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ITokenResponse {
  token: string;
}

export interface IGoogleAuthRequest {
  email: string;
  name: string;
}

export interface ISignUpRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface ITokenPayload {
  email: string;
  role: ROLES;
  iat?: number;
}
