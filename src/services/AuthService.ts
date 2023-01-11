import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import jwt, { Secret } from "jsonwebtoken";
import { ROLES } from "../enums/authEnum";
import { ISignUpRequest } from "../interfaces/authInterfaces";
import { UserModel } from "../models/UserModel";

@Injectable()
export class AuthService {
    constructor(@Inject(UserModel) private userModel: MongooseModel<UserModel>) { }
    async getUserInfo(email: string): Promise<UserModel | null> {
        return await this.userModel.findOne({
            email: email
        })
    }

    async insertOrUpdateUser(email: string, name: string,isGoogleAuth: boolean): Promise<unknown> {
        return await this.userModel.updateOne({ email: email }, { $set: { name: name ,isGoogleAuth: isGoogleAuth} }, { upsert: true, returnOriginal: false });
    }

    async createUser(signupRequest: ISignUpRequest,isGoogleAuth:boolean) {
        return this.userModel.create({
            email: signupRequest.email,
            isGoogleAuth: isGoogleAuth,
            name: signupRequest.name,
            password: signupRequest.password,
            phoneNumber: signupRequest.phoneNumber
        });
    }


    async generateJWTToken(email: string, role: ROLES): Promise<string> {
        const tokenPayload = { email, role };
        const token = await jwt.sign(tokenPayload, process.env.TOKEN_KEY as Secret);
        return token;
    }
}
