import DriverRepository from "../../database/repositories/driver.repositories.js";
import AppError from "../../utils/appError.js";
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from "../constants/errorCodes.js";

class ExistCheck {
  constructor() {
    this.repository = new DriverRepository();
  }

  async ForSignup({ email }) {
    const userCount = await this.repository.CountUser({ email });

    if (userCount > 0) throw new AppError(USER_NOT_FOUND, "User already exists with this Email ID", 400);
  }

  async ForLogin({ email }) {
    const userCount = await this.repository.CountUser({ email });

    if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No user found with provided email id.", 400);
  }
}

export default ExistCheck;
