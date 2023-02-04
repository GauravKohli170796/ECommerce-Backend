import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";

@Controller("")
export class HelloWorldController {
  @Get("/checkServerHealth")
  get() {
    return "Server is up and running !.";
  }
}
