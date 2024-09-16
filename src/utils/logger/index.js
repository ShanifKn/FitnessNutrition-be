import DevLogger from "./devLogger.js";
import ProdLogger from "./prodLogger.js";

let logger = null;

if (process.env.NODE_ENV === "dev") logger = DevLogger();

if (process.env.NODE_ENV === "prod") logger = ProdLogger();

export default logger;
