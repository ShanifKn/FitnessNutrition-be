import { INCORRECT_OTP } from "../api/constants/errorCodes.js";
import UserHelper from "../api/helpers/user.helper.js";
import AppError from "../utils/appError.js";
import MailService from "./mail.service.js";

class UserService {
  constructor() {
    this.userHelper = new UserHelper();
    this.mailService = new MailService();
  }

  async UserLogin({ email, password }) {
    const user = await this.userHelper.ValidateUserLogin({ email, password });

    if (!user) return { message: "Invalid user" };

    const { otp } = await this.userHelper.SendOtpMail({ user });

    return { message: `Otp send successfully OTP:${otp}` };
  }

  async CreateUser({ email, password }) {
    //convert password to hash
    password = await this.userHelper.CreateHash(password);

    return await this.userHelper.createUser({ email, password });
  }

  async VerifyOtp({ email, otp }) {
    const { _id } = await this.userHelper.FindByEmail({ email });

    const verified = await this.userHelper.VerifyOtp({ _id, otp });

    if (!verified) throw new AppError(INCORRECT_OTP, "Incorrect Otp Number.", 400);

    const token = await this.userHelper.GenerateSignedJwt(verified);

    return { token: token, message: "User login successful" };
  }

  async ResendOpt({ email, otp }) {
    const { _id } = await this.userHelper.FindByEmail({ email });

    const user = await this.userHelper.VerifyOtp({ _id, otp });

    if (user) return this.mailService.SendOtpMail(email, user.otp);

    return this.userHelper.SendOtpMail({ user });
  }
}

export default UserService;
