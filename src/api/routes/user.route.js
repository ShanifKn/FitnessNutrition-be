import UserService from "../../services/user.service.js";
import { tryCatch } from "../../utils/index.js";
import { LoginRateLimiter } from "../middlewares/apiLimiter.js";
import ExistCheck from "../validations/existCheck.js";
import { SchemaValidationForLogin } from "../validations/schema.validation.js";
import Validate from "../validations/validator.js";

const UserRouter = (app) => {
  const userExists = new ExistCheck();
  const service = new UserService();

  // @route   GET /
  // @des     For health check
  // @access  Public
  app.get(
    "",
    tryCatch(async (req, res) => {
      return res.status(200).json("Running");
    })
  );

  // @route POST /signup
  app.post(
    "/signup",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { email, password } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForSignup({ email });

      const { message } = await service.CreateUser({ email, password });

      return res.status(200).json({ message });
    })
  );

  // @route   POST /login
  // @desc    admin login
  // @access  Public
  // @fields  email,password
  app.post(
    "/login",
    LoginRateLimiter,
    SchemaValidationForLogin,
    Validate,
    tryCatch(async (req, res) => {
      const { email, password } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForLogin({ email });

      const { message } = await service.UserLogin({ email, password });


      return res.status(200).json({ message });
    })
  );

  // @route   POST /otp-verify
  // @desc    otp verification
  // @access  Public
  // @fields  email,otp
  app.post(
    "/otp-verify",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { email, otp } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForLogin({ email });

      const { token, message } = await service.VerifyOtp({ email, otp });

      return res.status(200).json({ message, token });
    })
  );

  app.post(
    "/send-otp",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { email, otp } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForLogin({ email });

      const { message } = await service.VerifyOtp({ email, otp });

      return res.status(200).json({ message });
    })
  );
};

export default UserRouter;
