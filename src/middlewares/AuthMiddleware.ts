import { Inject, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { ITokenPayload } from "../interfaces/authInterfaces";
import { AuthService } from "../services/AuthService";

@Middleware()
export class AuthMiddleware implements MiddlewareMethods {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  async use(@Req() request: Req) {
    const token = request.headers["authorization"]?.split(" ")[1];
    if (!(token && token.split(".").length > 1)) {
      throw new Unauthorized("Token is not present in headers.");
    }
    try {
      const userDetails: ITokenPayload = await this.authService.decodeJwtGenerate(token);
      request.user = userDetails;
    } catch (err) {
      console.error(err);
      throw new Unauthorized(err.message);
    }
  }
}
