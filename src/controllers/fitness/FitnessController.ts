import { BodyParams, PathParams, Req, UseBefore } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { FitnessModel } from "src/models/FitnessModel";
import { FitnessService } from "src/services/FitnessService";
import { IAddWalkPadDataRequest } from "src/interfaces/fitnessInterfaces";

@Controller("")
@UseBefore(AuthMiddleware)
export class FitnessController {
  constructor(@Inject(FitnessService) private fitnessService: FitnessService) {}

//   @Get("/getCartItems")
//   get(@Req() req: Req) {
//     const userDetails = req.user as ITokenPayload;
//     return this.cartService.getUserCartItems(userDetails.email);
//   }
  @Post("/addFitnessData")
  addFitnessData(@Req() req: Req, @BodyParams() @Required() fitnessData: IAddWalkPadDataRequest) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.addFitnessData(userDetails.email, fitnessData);
  }
//   @Put("/updateCartItem/:id")
//   updateCartItem(
//     @Req() req: Req,
//     @PathParams("id") @Required() id: string,
//     @BodyParams() @Required() cartItem: ICartUpdateReq
//   ) {
//     const userDetails = req.user as ITokenPayload;
//     return this.cartService.updateItemOfUserCart(userDetails.email, id, cartItem);
//   }
//   @Delete("/deleteCartItem/:id")
//   deleteCartItem(@Req() req: Req, @PathParams("id") @Required() id: string) {
//     const userDetails = req.user as ITokenPayload;
//     return this.cartService.deleteItemFromUserCart(userDetails.email, id);
//   }

//   @Delete("/deleteUserCart")
//   deleteCart(@Req() req: Req) {
//     const userDetails = req.user as ITokenPayload;
//     return this.cartService.deleteUserCart(userDetails.email);
//   }
}
