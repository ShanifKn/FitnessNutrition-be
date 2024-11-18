import UserRepository from "../../database/repositories/user.repositories.js";
import bcrypt from "bcrypt";
import { JWT_OPTIONS, JWT_SECRET, PRIVATE_KEY } from "../../config/index.js";
import { AppError } from "../../utils/index.js";
import { PASSWORD_MISSMATCHED } from "../constants/errorCodes.js";
import MailService from "../../services/mail.service.js";
import jwt from "jsonwebtoken";

class UserHelper {
  constructor() {
    this.respository = new UserRepository();
    this.mailService = new MailService();
  }

  async ValidateUserLogin({ email, password }) {
    const user = await this.respository.FindOneUserEmail({ email });

    const isMatched = await this.ValidateHashPassword(password, user.password);

    if (!isMatched) throw new AppError(PASSWORD_MISSMATCHED, "Invalid password & email", 400);

    return user;
  }

  async ValidateHashPassword(password, hashPassword) {
    // Concatenate the user's input password with the private key
    const combinedValue = PRIVATE_KEY + password + PRIVATE_KEY;

    return bcrypt.compare(combinedValue, hashPassword);
  }

  async SendOtpMail({ user }) {
    const code = await this.respository.OtpExist(user._id);

    if (code) return true;

    const generatedCode = await this.CreateOtpCode(user._id);

    return this.mailService.SendOtpMail(user.email, generatedCode.otp);
  }

  async CreateOtpCode({ _id }) {
    const generatedCode = Math.floor(1000 + Math.random() * 9000);

    return await this.respository.CreateUserOtp({ _id, generatedCode });
  }

  async CreateHash(password) {
    const saltRounds = 10; // The cost factor determines the computational complexity of the hashing process

    // Generate a salt
    const salt = bcrypt.genSaltSync(saltRounds);

    // Concatenate the password and private key
    const combinedValue = PRIVATE_KEY + password + PRIVATE_KEY;

    // Generate the bcrypt hash
    return await bcrypt.hashSync(combinedValue, salt);
  }

  async createUser({ email, password }) {
    return await this.respository.CreateNewUser({ email, password });
  }

  async VerifyOtp({ _id, otp }) {
    return await this.respository.VerifyOtp({ userId: _id, otp });
  }

  async GenerateSignedJwt(user) {
    const tokenUser = {
      _id: user._id,
      email: user.email,
    };

    return jwt.sign(tokenUser, JWT_SECRET, JWT_OPTIONS);
  }

  async FindByEmail({ email }) {
    return await this.respository.FindOneUserEmail({ email });
  }
}

export default UserHelper;
