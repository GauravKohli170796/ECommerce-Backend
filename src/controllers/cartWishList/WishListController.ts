import { Req, UseBefore } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Delete, Get, Post, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { IWishListItem } from "../../interfaces/productInterface";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { WishListService } from "../../services/WishListService";

@Controller("")
@UseBefore(AuthMiddleware)
export class WishListController {
  constructor(@Inject(WishListService) private wishListService: WishListService) {}

  @Get("/getWishListItems")
  get(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.wishListService.getUserWishListItems(userDetails.email);
  }
  @Post("/addWishListItem")
  addCartItem(@Req() req: Req, @BodyParams() @Required() cartItem: IWishListItem) {
    const userDetails = req.user as ITokenPayload;
    return this.wishListService.addItemToUserWishList(userDetails.email, cartItem);
  }
  @Delete("/deleteWishListItem/:id")
  deleteCartItem(@Req() req: Req, @PathParams("id") @Required() id: string) {
    const userDetails = req.user as ITokenPayload;
    return this.wishListService.deleteItemFromUserWishList(userDetails.email, id);
  }

  @Delete("/deleteUserWishList")
  deleteCart(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.wishListService.deleteUserWishList(userDetails.email);
  }
}
