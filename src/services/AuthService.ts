import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import jwt, { Secret } from "jsonwebtoken";
import { ROLES } from "../enums/authEnum";
import { IJwtTokens, ILoginRequest, ISignUpRequest, ITokenPayload } from "../interfaces/authInterfaces";
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

  async generateAccessToken(email: string, role: ROLES): Promise<string> {
    const tokenPayload: ITokenPayload = { email, role };
    const accessToken = await jwt.sign(tokenPayload, process.env.TOKEN_KEY as Secret, { expiresIn: "7 days" });
    return accessToken;
  }

  async generateRefreshToken(email: string, role: ROLES): Promise<string> {
    const tokenPayload: ITokenPayload = { email, role };
    const refreshToken = await jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_KEY as Secret);
    return refreshToken;
  }

  async generateJWTToken(email: string, role: ROLES): Promise<IJwtTokens> {
    const accessToken = await this.generateAccessToken(email, role);
    const refreshToken = await this.generateRefreshToken(email, role);
    return { accessToken, refreshToken };
  }

  async generateAccessTokenFromRefreshToken(refreshToken: string) {
    const userDetails = await this.decodeJwtGenerate(refreshToken, false);
    const newAccessToken = await this.generateAccessToken(userDetails.email, userDetails.role);
    return newAccessToken;
  }

  async decodeJwtGenerate(jwtToken: string, isAccess = true): Promise<ITokenPayload> {
    if (isAccess) {
      const userDetails = (await jwt.verify(jwtToken, process.env.TOKEN_KEY as Secret)) as ITokenPayload;
      return userDetails;
    }
    const userDetails = (await jwt.verify(jwtToken, process.env.REFRESH_TOKEN_KEY as Secret)) as ITokenPayload;
    return userDetails;
  }
}
