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


// production code 

// import express from "express";
// import { DatabaseConnection } from "./database/index.js";
// import ExpressApp from "./express-app.js";
// import { logger } from "./utils/index.js";
// import bodyParser from "body-parser";
// import https from "https";
// import http from "http";
// import fs from "fs";

// const StartServer = async () => {
//   const app = express();
//   await DatabaseConnection();
//   await ExpressApp(app);
//   const HTTPS_PORT = 8002;
//   const HTTP_PORT = 8003;
//   // Load SSL certificate
//   const options = {
//     key: fs.readFileSync("src/ssl/fitnmuscles.key"),
//     cert: fs.readFileSync("src/ssl/fitnmuscles.crt"),
//     ca: fs.readFileSync("src/ssl/fitnmuscles.ca-bundle"),
//   };

//   app.use((req, res, next) => {
//     if (req.headers["x-forwarded-proto"] !== "https") {
//       return res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });

//   // Start HTTPS server
//   https
//     .createServer(options, app)
//     .listen(HTTPS_PORT, () => {
//         logger.info(`Secure server running on https://api.fitnmuscles.com:${HTTPS_PORT}`);
//     })
//     .on("error", (err) => {
//       // console.log(err);
//       //   logger.error(err);
//       process.exit();
//     });
// };

// StartServer();
