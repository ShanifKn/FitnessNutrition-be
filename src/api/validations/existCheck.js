import ProductRepository from "../../database/repositories/product.repositories.js";
import UserRepository from "../../database/repositories/user.repositories.js";
import AppError from "../../utils/appError.js";
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from "../constants/errorCodes.js";

class ExistCheck {
  constructor() {
    this.userRep = new UserRepository();
    this.productRep = new ProductRepository();
  }

  // check if user exists in case
  async ForLogin({ email }) {
    const userCount = await this.userRep.CountUserByEmail({
      email,
    });

    if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No user found with provided email id.", 400);
  }

  async ForSignup({ email }) {
    const userCount = await this.userRep.CountUserByEmail({
      email,
    });

    if (userCount > 0) throw new AppError(USER_ALREADY_EXISTS, "User already exists with this Email ID. Please login", 400);
  }

  async ForCustomerSignup({ email }) {
    const userCount = await this.userRep.CountCustomerByEmail({ email });

    if (userCount > 0) return true;
  }

  async ForCustomer({ email }) {
    const userCount = await this.userRep.CountCustomerByEmail({ email });

    if (userCount > 0) throw new AppError(USER_ALREADY_EXISTS, "Email already registered. Please log in.", 400);
  }

  async ForCustomerVerfication({ email, phone }) {
    if (phone) {
      const userCount = await this.userRep.CountCustomerByPhone({ phone });

      if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No user found with this phone number.", 400);
    } else {
      const userCount = await this.userRep.CountCustomerByEmail({ email });

      if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No user found with this email.", 400);
    }
  }

  async ForCustomerLogin({ email }) {
    const userCount = await this.userRep.CountCustomerByEmail({ email });

    if (userCount < 1) throw new AppError(USER_NOT_FOUND, "No user found with this email.", 400);
  }

  async ForCustomerPhone({ phone }) {
    const userCount = await this.userRep.CountCustomerByPhone({ phone });

    if (userCount > 0) throw new AppError(USER_ALREADY_EXISTS, "Phone number already registered. Please log in.", 400);
  }

  async ForProduct(_id) {
    const productCount = await this.productRep.CountUserByProduct(_id);

    if (productCount < 0) return null;
  }
}

export default ExistCheck;
