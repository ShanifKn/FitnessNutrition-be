import express from "express";
import { PORT } from "./config/index.js";
import { DatabaseConnection } from "./database/index.js";
import ExpressApp from "./express-app.js";
import { logger } from "./utils/index.js";
import bodyParser from "body-parser";

const StartServer = async () => {
  const app = express();

  await DatabaseConnection();

  await ExpressApp(app);


  app
    .listen(PORT, () => {
      logger.info(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit();
    });
};

StartServer();
