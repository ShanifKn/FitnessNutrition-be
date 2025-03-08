import DriverRepository from "../../database/repositories/driver.repositories.js";
import crypto from "crypto";
import UserHelper from "./user.helper.js";
import MailService from "../../services/mail.service.js";
import AppError from "../../utils/appError.js";
import { PASSWORD_MISSMATCHED } from "../constants/errorCodes.js";

class DriverHelper {
  constructor() {
    this.repository = new DriverRepository();
    this.userHelper = new UserHelper();
    this.mailService = new MailService();
  }

  async createDriver({ image, name, email, phone, whatappPhone, branch, location, dlNo }) {
    const generatePassword = await this.generateRandomPassword();

    const password = await this.userHelper.CreateHash(generatePassword);

    const create = await this.repository.createOrUpdateDriver({ password, image, name, email, phone, whatappPhone, branch, location, dlNo });

    setTimeout(() => {
      this.sendLoginCredentialsSms({ phone, email, generatePassword });
    }, 2000);

    return create;
  }

  async sendLoginCredentialsSms({ phone, email, generatePassword }) {
    await this.mailService.sendLoginCredentialsSms(phone, email, generatePassword);
  }

  async generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
  }

  async getDriverWithLimit({ pageInt, limitInt, skip }) {
    return await this.repository.getDriverWithLimit({ pageInt, limitInt, skip });
  }

  async getDriverDetails({ _id }) {
    return await this.repository.getDriverDetails({ _id });
  }

  async updateDriver({ _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active }) {
    return await this.repository.updateDriver({ _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active });
  }

  async driverLogin({ email, password }) {
    const user = await this.repository.findUserByEmail({ email });

    if (!user) return null;

    const isMatched = await this.userHelper.ValidateHashPassword(password, user.password);

    if (!isMatched) throw new AppError(PASSWORD_MISSMATCHED, "Invalid password & email", 400);

    const token = await this.userHelper.GenerateSignedJwt(user);

    return { token, message: "Login successfully" };
  }

  async resetPassword({ email }) {
    const user = await this.repository.findUserByEmail({ email });

    const { phone } = user;

    const generatePassword = await this.generateRandomPassword();

    const password = await this.userHelper.CreateHash(generatePassword);

    await this.repository.UpdatePassword({ email, password });

    setTimeout(() => {
      this.sendLoginCredentialsSms({ phone, email, generatePassword });
    }, 5000);

    return { message: "Reset password sent via SMS successfully." };
  }

  async getDriverOrderCount({ driverId }) {
    return await this.repository.getDriverOrderCount({ driverId })
  }
}

export default DriverHelper;
