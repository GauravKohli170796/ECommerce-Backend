import { BodyParams, PathParams, Req } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { Get, Post, Put, Required } from "@tsed/schema";
import { IAddressInfo } from "../../interfaces/addressInterfaces";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { AddressService } from "../../services/AddressService";

@Controller("")
@UseBefore(AuthMiddleware)
export class AddressController {
  constructor(@Inject(AddressService) private addressService: AddressService) {}
  @Get("/getAllUserAddress")
  get(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.addressService.getAllUserAddress(userDetails.email);
  }

  @Post("/addAddress")
  updateOrInsertAddress(@Req() req: Req, @BodyParams() @Required() addressInfo: IAddressInfo) {
    const userDetails = req.user as ITokenPayload;
    return this.addressService.addAddress({ ...addressInfo, email: userDetails.email });
  }

  @Put("/updateAddress/:id")
  updateAddress(
    @Req() req: Req,
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() addressInfo: IAddressInfo
  ) {
    const userDetails = req.user as ITokenPayload;
    return this.addressService.updateAddress(id, { ...addressInfo, email: userDetails.email });
  }
}
