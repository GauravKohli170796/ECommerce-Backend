import { Req, Res } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Forbidden } from "@tsed/exceptions";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { ROLES } from "../enums/authEnum";
import { ITokenPayload } from "../interfaces/authInterfaces";
import { AuthService } from "../services/AuthService";

@Middleware()
export class AdminMiddleware implements MiddlewareMethods {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(@Req() request: Req, @Res() response: Res) {
    const userDetails = request.user as ITokenPayload;
    if (userDetails?.role !== ROLES.ADMIN) {
      throw new Forbidden("You dont have enough privileges to perform an action");
    }
  }
}
