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

    const otp = await this.userHelper.SendOtpMail({ user });

    return { message: `Otp send successfully OTP:${otp}` };
  }

  async CreateUser({ email, password }) {
    //convert password to hash
    password = await this.userHelper.CreateHash(password);

    const user = await this.userHelper.createUser({ email, password });

    if (email) await this.userHelper.SendOtpMail({ user });

    return { message: `Otp send successfully OTP` };
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

    if (user) return await this.mailService.sendOtpMail(email, user.otp);

    return await this.userHelper.SendOtpMail({ user });
  }

  async CreateCustomer({ _id, email, name, password, image, phone, DOB, gender }) {
    return await this.userHelper.CreateCustomer({ _id, email, name, password, image, phone, DOB, gender });
  }

  async CustomerSignup({ email }) {
    return await this.userHelper.CustomerSignup({ email });
  }

  async CustomerCreate({ name, email, password, phone }) {
    //convert password to hash
    password = await this.userHelper.CreateHash(password);

    const user = await this.userHelper.CustomerCreateDB({ name, email, password, phone });

    // if (user && email) await this.userHelper.SendOtpMail({ user });

    // if (user && phone) await this.userHelper.SendOtpPhone({ user });

    await this.userHelper.CreateCustomerZoho(user);

    return { message: `Otp send successfully OTP` };
  }

  async CustomerVerfication({ email, phone, otp }) {
    let user = null;

    if (email) {
      user = await this.userHelper.FindCustomerBYEmail({ email });
    }

    if (phone) {
      user = await this.userHelper.FindCustomerBYPhone({ phone });
    }

    const { _id } = user;

    const verified = await this.userHelper.VerifyOtp({ _id, otp });

    if (!verified) throw new AppError(INCORRECT_OTP, "Incorrect Otp Number.", 400);

    const token = await this.userHelper.GenerateSignedJwt(verified);

    return { token: token, message: "User login successful" };
  }
}

export default UserService;
