import { Inject, Req } from "@tsed/common";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { ITokenPayload } from "../interfaces/authInterfaces";
import { AuthService } from "../services/AuthService";

@Middleware()
export class AuthMiddleware implements MiddlewareMethods {
  constructor(@Inject(AuthService) private authService: AuthService) { }
  use(@Req() request: Req) {
      const token = request.headers["authorization"]?.split(" ")[1];
      if(!token){
        throw new Unauthorized("Token is not present in headers.");
      }
      this.authService.decodeJwtGenerate(token).then((userDetails: ITokenPayload)=>{
        request.user = userDetails;
      }).catch((err)=>{
        throw new BadRequest(err);
      })
  }
}
