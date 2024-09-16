import { createLogger, format, transports } from "winston";
import { DB_URL } from "../../config/index.js";
import myFormat from "./format.js";
import "winston-mongodb";

const { combine, timestamp, json, metadata } = format;

const ProdLogger = () => {
  return createLogger({
    level: "info",

    format: combine(timestamp(), json(), myFormat, metadata()),

    defaultMeta: { service: "user-service" },

    transports: [
      new transports.Console(),
      new transports.MongoDB({
        level: "error",
        db: DB_URL,
        options: { useUnifiedTopology: true },
        collection: "errorlogs",
      }),
    ],
  });
};

export default ProdLogger;
