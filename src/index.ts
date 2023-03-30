import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import axios from "axios";
import { Server } from "./Server";
// eslint-disable-next-line prefer-const
let interval: string | number | NodeJS.Timer | undefined;

async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();

    process.on("SIGINT", () => {
      clearInterval(interval);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      platform.stop();
    });
  } catch (error) {
    clearInterval(interval);
    $log.error({ event: "SERVER_BOOTSTRAP_ERROR", message: error.message, stack: error.stack });
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

interval = setInterval(() => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  keepServerAlive();
}, 1000 * 60 * 10);

async function keepServerAlive() {
  try {
    const { data } = await axios.get(
      "https://ecommerce-backend-repo-og97.onrender.com/api/v1/healthCheck/checkServerHealth"
    );
    // eslint-disable-next-line no-console
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
