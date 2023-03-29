export enum EmailTypes {
  SIGNUP = "SIGNUP",
  FORGET_PASSWORD = "FORGET_PASSWORD"
}
export interface IEmailBody {
  otp: string;
  type: EmailTypes;
  email: string;
}
