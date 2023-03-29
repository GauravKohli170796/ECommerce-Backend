import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post, Required } from "@tsed/schema";
import { IEmailBody } from "../../interfaces/emailInterfaces";
import { EmailService } from "../../services/EmailService";

@Controller("")
export class EmailController {
  constructor(@Inject(EmailService) private emailService: EmailService) {}
  @Post("/send-otp")
  sendOtp(@BodyParams() @Required() emailBody: IEmailBody): Promise<boolean> {
    return this.emailService.sendOtp(emailBody);
  }
}
