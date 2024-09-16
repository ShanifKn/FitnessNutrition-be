import { createLogger, format, transports } from "winston";
import myFormat from "./format.js";

const { combine, timestamp, label } = format;

const DevLogger = () => {
  return createLogger({
    level: "debug",

    format: combine(format.colorize(), label({ label: "right meow!" }), timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), myFormat),

    transports: [new transports.Console()],
  });
};

export default DevLogger;
