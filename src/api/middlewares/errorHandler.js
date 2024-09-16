import { AppError, logger } from "../../utils/index.js";

const ErrorHandler = (error, req, res, next) => {
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") return InvalidTokenHandler(error, res);

  if (error instanceof AppError) return AppErrorHandler(error, req, res);

  ErrorLogger(`${error}`, req, 500);

  return res.status(500).json({ message: `${error}` });
};

async function InvalidTokenHandler(error, res) {
  return res.status(401).json({
    errorCode: 401,
    message: "Token is not valid or expired, please authenticate again",
  });
}

async function AppErrorHandler(error, req, res) {
  ErrorLogger(error.message, req, error.errorCode);

  return res.status(error.statusCode).json({
    errorCode: error.errorCode,
    message: error.message,
  });
}

async function ErrorLogger(message, req, errorCode) {
  logger.error(message, {
    userId: req.user && req.user._id,
    errorCode,
    body: req.body,
  });
}

export default ErrorHandler;
