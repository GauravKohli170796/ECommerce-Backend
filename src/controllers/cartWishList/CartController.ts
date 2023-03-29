import { BodyParams, PathParams, Req, UseBefore } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { ICartItem, ICartUpdateReq } from "../../interfaces/productInterface";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { CartService } from "../../services/CartService";

@Controller("")
@UseBefore(AuthMiddleware)
export class CartController {
  constructor(@Inject(CartService) private cartService: CartService) {}

  @Get("/getCartItems")
  get(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.cartService.getUserCartItems(userDetails.email);
  }
  @Post("/addCartItem")
  addCartItem(@Req() req: Req, @BodyParams() @Required() cartItem: ICartItem) {
    const userDetails = req.user as ITokenPayload;
    return this.cartService.addItemToUserCart(userDetails.email, cartItem);
  }
  @Put("/updateCartItem/:id")
  updateCartItem(
    @Req() req: Req,
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() cartItem: ICartUpdateReq
  ) {
    const userDetails = req.user as ITokenPayload;
    return this.cartService.updateItemOfUserCart(userDetails.email, id, cartItem);
  }
  @Delete("/deleteCartItem/:id")
  deleteCartItem(@Req() req: Req, @PathParams("id") @Required() id: string) {
    const userDetails = req.user as ITokenPayload;
    return this.cartService.deleteItemFromUserCart(userDetails.email, id);
  }

  @Delete("/deleteUserCart")
  deleteCart(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.cartService.deleteUserCart(userDetails.email);
  }
}
