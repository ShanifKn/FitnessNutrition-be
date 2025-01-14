import UserService from "../../services/user.service.js";
import { tryCatch } from "../../utils/index.js";
import { LoginRateLimiter } from "../middlewares/apiLimiter.js";
import Authentication from "../middlewares/authentication.js";
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

  // @route POST /signup
  app.post(
    "/signup-firebase",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, email, name, password, image, phone, DOB, gender } = req.body;

      const user = await userExists.ForCustomerSignup({ email });

      let data;

      if (!user) {
        data = await service.CreateCustomer({ _id, email, name, password, image, phone, DOB, gender });
      } else {
        data = await service.CustomerSignup({ email });
      }

      return res.status(200).json({ data, message: "Successfully logged in!" });
    })
  );

  // @route POST /signup
  //@des signup with clinet-side
  app.post(
    "/customer-signup",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { name, email, password, phone } = req.body;

      //Check if user already exists with given email and role
      if (email) await userExists.ForCustomer({ email });

      if (phone) await userExists.ForCustomerPhone({ phone });

      const { message } = await service.CustomerCreate({ name, email, password, phone });

      return res.status(200).json({ message });
    })
  );

  // @route   POST /login
  // @desc    admin login
  // @access  Public
  // @fields  email,password
  app.post(
    "/customer-login",
    LoginRateLimiter,
    SchemaValidationForLogin,
    Validate,
    tryCatch(async (req, res) => {
      const { email, password } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForCustomerLogin({ email });

      const { message, token } = await service.CustomerLogin({ email, password });

      return res.status(200).json({ token, message });
    })
  );

  // @route   POST /login
  // @desc    admin login
  // @access  Public
  // @fields  email,password
  app.post(
    "/customer-phone",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { email, phone } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForCustomerVerfication({ email, phone });

      const { message } = await service.CustomerLoginPhone({ phone });

      return res.status(200).json({ message });
    })
  );

  // @route   POST /otp-verify
  // @desc    otp verification
  // @access  Public
  // @fields  email,otp
  app.post(
    "/customer-verify",
    LoginRateLimiter,
    Validate,
    tryCatch(async (req, res) => {
      const { email, phone, otp } = req.body;

      //Check if user already exists with given email and role
      await userExists.ForCustomerVerfication({ email, phone });

      const { token, message } = await service.CustomerVerfication({ email, phone, otp });

      return res.status(200).json({ message, token });
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

  app.post(
    "/create-address",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const userId = req.user._id;

      const { _id, type, flatno, flatname, street, landMark, pin, city, country, delivery } = req.body;

      const data = await service.CreateAddress({ userId, _id, type, flatno, flatname, street, landMark, pin, city, country, delivery });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/userDetails",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const userId = req.user._id;

      const data = await service.GetUserDetails({ userId });

      return res.status(200).json({ data });
    })
  );

  app.delete(
    "/delete-address/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const userId = req.user._id;

      const { _id } = req.params;

      const { message } = await service.DeleteAddress({ userId, _id });

      return res.status(200).json({ message });
    })
  );

  app.post(
    "/delivery-address",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const userId = req.user._id;

      const { _id } = req.body;

      const data = await service.DeliveryAddress({ userId, _id });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/update-user",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const userId = req.user._id;

      const { email, name, image, phone, dob, gender } = req.body;

      const data = await service.UpdateUser({ userId, email, name, image, phone, dob, gender });

      return res.status(200).json({ data });
    })
  );
};

export default UserRouter;
