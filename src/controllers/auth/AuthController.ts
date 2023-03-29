import { Controller, Inject } from "@tsed/di";
import { BadRequest, NotFound, Unauthorized } from "@tsed/exceptions";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Get, Post, Put, Required } from "@tsed/schema";
import bcrypt from "bcryptjs";
import { IGoogleAuthRequest, ILoginRequest, ISignUpRequest, ITokenResponse } from "../../interfaces/authInterfaces";
import { AuthService } from "../../services/AuthService";

@Controller("")
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  @Post("/Login")
  async logInUser(@BodyParams() @Required() loginRequest: ILoginRequest): Promise<ITokenResponse> {
    const userInfo = await this.authService.getUserInfo(loginRequest.email);
    if (!userInfo) {
      throw new NotFound("Username is not registered");
    }
    if (!userInfo.password) {
      throw new BadRequest("Your email is registered using Google Auth. Please Login using Google Auth");
    }
    const verifyPassword = await bcrypt.compare(loginRequest.password, userInfo.password);
    if (!verifyPassword) {
      throw new Unauthorized("Password is incorrect");
    }
    return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) };
  }
  @Post("/SignUp")
  async signUpUser(@BodyParams() @Required() signupRequest: ISignUpRequest): Promise<ITokenResponse> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(signupRequest.password, salt);
    signupRequest.password = hashPassword;
    const userInfo = await this.authService.createUser(signupRequest);
    return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) };
  }

  @Put("/changePassword")
  async changePassword(@BodyParams() @Required() passChangeReq: ILoginRequest): Promise<boolean> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(passChangeReq.password, salt);
    passChangeReq.password = hashPassword;
    return await this.authService.changePassword(passChangeReq);
  }

  @Get("/checkUserExist/:email")
  async getUserInfo(@PathParams("email") @Required() email: string) {
    const userInfo = await this.authService.getUserInfo(email);
    if (!userInfo) {
      throw new NotFound("Email is not registered. Please check email.");
    }
    const user = {
      email: userInfo?.email,
      password: userInfo?.password ? "**************" : null
    };
    return user;
  }

  @Post("/GoogleAuth")
  async googleAuth(@BodyParams() @Required() googleAuth: IGoogleAuthRequest) {
    const response = await this.authService.insertOrUpdateUser(googleAuth.email, googleAuth.name);
    if (response.password) {
      throw new BadRequest(
        "Email is already registered. Please login directly or use forget password in case you forget it."
      );
    }
    const userInfo = await this.authService.getUserInfo(googleAuth.email);
    if (!userInfo) {
      throw new BadRequest("Something went wrong.Try again!");
    }
    return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) };
  }
}
