import UserRepository from "../../database/repositories/user.repositories.js";
import AppError from "../../utils/appError.js";
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from "../constants/errorCodes.js";

class ExistCheck {
  constructor() {
    this.userRep = new UserRepository();
  }

  // check if user exists in case
  async ForLogin({ email }) {
    const userCount = await this.userRep.CountUserByEmail({
      email,
    });

    if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No verified user found with provided details.", 404);
  }

  async ForSignup({ email }) {
    const userCount = await this.userRep.CountUserByEmail({
      email,
    });

    if (userCount > 0) throw new AppError(USER_ALREADY_EXISTS, "User already exists with this Email ID. Please login", 400);
  }
}

export default ExistCheck;
