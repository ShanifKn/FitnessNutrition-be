import SetConfigPath from "./enviroment.js";

await SetConfigPath();

const PORT = process.env.PORT;

const DB_URL = process.env.MONGODB_URL;

const JWT_SECRET = process.env.JWT_SECRET;

export { PORT, DB_URL, JWT_SECRET };
