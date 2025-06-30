import { BodyParams, PathParams, Req, UseBefore } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { FitnessService } from "../../services/FitnessService";
import { IAddWalkPadDataRequest, IGoalsDataRequest } from "../../interfaces/fitnessInterfaces";

@Controller("")
@UseBefore(AuthMiddleware)
export class FitnessController {
  constructor(@Inject(FitnessService) private fitnessService: FitnessService) { }
  @Post("/addFitnessData")
  addFitnessData(@Req() req: Req, @BodyParams() @Required() fitnessData: IAddWalkPadDataRequest) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.addFitnessData(userDetails.email, fitnessData);
  }

  @Get("/getFitnessMetrics")
  getFitnessMetrics(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.getFitnessMetrics(userDetails.email);
  }

  @Get("/getFitnessData/:limit/:page/:sortRule")
  getFitnessData(@PathParams("limit") @Required() limit: string, @PathParams("page") @Required() page: string, @PathParams("sortRule") @Required() sortRule: string, @Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.getFitnessData(userDetails.email, parseInt(limit), parseInt(page), sortRule);
  }

  @Get("/getFitnessMonthCalender/:startDate/:endDate")
  getFitnessMonthCalender(@PathParams("startDate") @Required() startDate: string, @PathParams("endDate") @Required() endDate: string, @Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.getFitnessMonthCalender(userDetails.email, startDate, endDate);
  }

  @Get("/getFitnessGoalsData")
  getFitnessGoalsData(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.getGoalData(userDetails.email);
  }

  @Put("/addFitnessGoalsData")
  addFitnessGoalsData(@Req() req: Req, @BodyParams() @Required() goalsData: IGoalsDataRequest) {
    const userDetails = req.user as ITokenPayload;
    return this.fitnessService.addUpdateGoalData(userDetails.email,goalsData);
  }
}
