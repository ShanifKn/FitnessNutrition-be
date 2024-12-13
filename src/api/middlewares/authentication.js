import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/index.js";
import { AppError, tryCatch } from "../../utils/index.js";
import { TOKEN_VERIFICATION_FAIL } from "../constants/errorCodes.js";

const Authentication = tryCatch(async (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if not token
  if (!token) throw new AppError(TOKEN_VERIFICATION_FAIL, "Your token has expired for security reasons. Please log in again.", 401);

  //Verify token
  req.user = jwt.verify(token, JWT_SECRET);

  next();
});

export default Authentication;
