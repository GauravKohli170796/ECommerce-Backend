import { BodyParams, PathParams, Req, UseBefore } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { FitnessService } from "../../services/FitnessService";
import { IAddWalkPadDataRequest } from "../../interfaces/fitnessInterfaces";

@Controller("")
@UseBefore(AuthMiddleware)
export class FitnessController {
  constructor(@Inject(FitnessService) private fitnessService: FitnessService) { }
  @Post("/addFitnessData")
  addFitnessData(@Req() req: Req, @BodyParams() @Required() fitnessData: IAddWalkPadDataRequest) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.addFitnessData(userDetails.email, fitnessData);
  }

  @Get("/getFitnessData/:limit/:page")
  getFitnessData(@PathParams("limit") @Required() limit: string, @PathParams("page") @Required() page: string, @Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.getFitnessMetrics(userDetails.email, parseInt(limit), parseInt(page));
  }
}
