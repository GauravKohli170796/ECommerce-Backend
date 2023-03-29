import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ROLES } from "../enums/authEnum";
import { ILoginRequest, ISignUpRequest, ITokenPayload } from "../interfaces/authInterfaces";
import { UserModel } from "../models/UserModel";

@Injectable()
export class AuthService {
  constructor(@Inject(UserModel) private userModel: MongooseModel<UserModel>) {}
  async getUserInfo(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({
      email: email
    });
  }

  async insertOrUpdateUser(email: string, name: string): Promise<UserModel> {
    return await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { name: name, isGoogleAuth: true } },
      { upsert: true, returnOriginal: false }
    );
  }

  async createUser(signupRequest: ISignUpRequest) {
    try {
      const response = await this.userModel.create({
        email: signupRequest.email,
        isGoogleAuth: false,
        name: signupRequest.name,
        password: signupRequest.password,
        phoneNumber: signupRequest.phoneNumber
      });
      return response;
    } catch (err) {
      if (err.message.match("E11000")) {
        throw new BadRequest("Email is already registered");
      }
      console.error(err);
      throw new BadRequest("Something went wrong");
    }
  }

  async changePassword(passChangeReq: ILoginRequest) {
    const response = await this.userModel.findOneAndUpdate(
      { email: passChangeReq.email, password: { $exists: true } },
      {
        $set: {
          password: passChangeReq.password
        }
      }
    );
    if (response) {
      return true;
    }
    return false;
  }

  async generateJWTToken(email: string, role: ROLES): Promise<string> {
    const tokenPayload: ITokenPayload = { email, role };
    const token = await jwt.sign(tokenPayload, process.env.TOKEN_KEY as Secret);
    return token;
  }

  async decodeJwtGenerate(jwtToken: string): Promise<any> {
    const userDetails = (await jwt.verify(jwtToken, process.env.TOKEN_KEY as Secret)) as JwtPayload;
    return userDetails;
  }
}
