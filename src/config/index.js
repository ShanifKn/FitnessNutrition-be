import SetConfigPath from "./enviroment.js";

await SetConfigPath();

const PORT = process.env.PORT;

const DB_URL = process.env.MONGODB_URL;

const JWT_SECRET = process.env.JWT_SECRET;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const EMAIL_USER_ID = process.env.EMAIL_USER_ID;

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const BASE_URL = process.env.BASE_URL;

const ZOHO_GENERATE_TOKEN = process.env.ZOHO_TOKEN_URL;

const ZOHO_PRODUCT_URL = process.env.ZOHO_PRODUCT_URL;

const ZOHO_ORGANIZATION = process.env.ZOHO_ORGANIZATION;

const PAGE_LENGTH = process.env.ZOHO_PAGE_LENGTH;

const JWT_OPTIONS = {
  issuer: process.env.JWT_ISSUER,
  expiresIn: parseInt(process.env.JWT_EXPIRES),
  audience: process.env.JWT_AUDIENCE,
  subject: process.env.JWT_SUBJECT,
};

export { ZOHO_ORGANIZATION, BASE_URL, PORT, DB_URL, JWT_SECRET, PRIVATE_KEY, ZOHO_PRODUCT_URL, EMAIL_PASSWORD, EMAIL_USER_ID, JWT_OPTIONS, ZOHO_GENERATE_TOKEN, PAGE_LENGTH };
