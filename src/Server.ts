import "@tsed/ajv";
import { PlatformApplication } from "@tsed/common";
import { Configuration, Inject } from "@tsed/di";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import { join } from "path";
import { config } from "./config/index";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/api/v1/healthCheck": [
			`${__dirname}/controllers/rest/*.ts`,
		],
    "/api/v1/product": [
			`${__dirname}/controllers/product/*.ts`,
		],
    "/api/v1/auth": [
			`${__dirname}/controllers/auth/*.ts`,
		],
    "/api/v1/user": [
			`${__dirname}/controllers/cartWishList/*.ts`,
		],
    "/api/v1/email": [
			`${__dirname}/controllers/email/*.ts`,
		],
    "/api/v1/orders": [
			`${__dirname}/controllers/order/*.ts`,
		],
    "/api/v1/address": [
			`${__dirname}/controllers/address/*.ts`,
		]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
