import { Req } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { BodyParams } from "@tsed/platform-params";
import { Post, Required } from "@tsed/schema";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { IEmailBody } from "../../interfaces/emailInterfaces";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { EmailService } from "../../services/EmailService";

@Controller("/send-email")
@UseBefore(AuthMiddleware) 
export class EmailController {
  constructor(@Inject(EmailService) private emailService: EmailService) { }
  @Post("/")
  sendEmail(@Req() req: Req,@BodyParams() @Required() emailBody: IEmailBody): Promise<boolean> {
    const userDetails = req.user as ITokenPayload;
    return this.emailService.sendEmail(userDetails,emailBody);
  }
}
