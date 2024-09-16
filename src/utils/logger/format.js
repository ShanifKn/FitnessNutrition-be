import { format } from "winston";

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp}: ${message}`;
});

export default myFormat;
