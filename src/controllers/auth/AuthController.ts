import { Controller, Inject } from "@tsed/di";
import { BadRequest, NotFound, Unauthorized } from "@tsed/exceptions";
import { BodyParams } from "@tsed/platform-params";
import { Post, Required } from "@tsed/schema";
import bcrypt from "bcryptjs";
import { IGoogleAuthRequest, ILoginRequest, ISignUpRequest, ITokenResponse } from "../../interfaces/authInterfaces";
import { AuthService } from "../../services/AuthService";

@Controller("/")
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) { }
  @Post("/Login")
  async logInUser(@BodyParams() @Required() loginRequest: ILoginRequest): Promise<ITokenResponse> {
      const userInfo = await this.authService.getUserInfo(loginRequest.email);
      if (!userInfo) {
        throw new NotFound("Username is not registered");
      }
     const verifyPassword=await  bcrypt.compare(loginRequest.password, userInfo.password);
     if(!verifyPassword){
      throw new Unauthorized("Password is incorrect")
     }
      return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) };
  }
  @Post("/SignUp")
  async signUpUser(@BodyParams() @Required() signupRequest: ISignUpRequest): Promise<ITokenResponse> {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(signupRequest.password, salt);
      signupRequest.password = hashPassword;
      const userInfo= await this.authService.createUser(signupRequest,false);
      return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) };
    
  }

  @Post("/GoogleAuth")
  async googleAuth(@BodyParams() @Required() googleAuth : IGoogleAuthRequest){
    await this.authService.insertOrUpdateUser(googleAuth.email, googleAuth.name,true);
    const userInfo = await this.authService.getUserInfo(googleAuth.email);
    if (!userInfo) {
      throw new BadRequest("Something went wrong.Try again!");
    }
    return { token: await this.authService.generateJWTToken(userInfo.email, userInfo.role) }
  }

}


