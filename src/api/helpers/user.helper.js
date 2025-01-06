import UserRepository from "../../database/repositories/user.repositories.js";
import bcrypt from "bcrypt";
import { JWT_OPTIONS, JWT_SECRET, PRIVATE_KEY } from "../../config/index.js";
import { AppError } from "../../utils/index.js";
import { PASSWORD_MISSMATCHED } from "../constants/errorCodes.js";
import MailService from "../../services/mail.service.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import ZohoHelper from "./zoho.helper.js";
import ZohoService from "../../services/zoho.service.js";

class UserHelper {
  constructor() {
    this.respository = new UserRepository();
    this.mailService = new MailService();
    this.zohoService = new ZohoService();
  }

  async ValidateUserLogin({ email, password }) {
    const user = await this.respository.FindOneUserEmail({ email });

    const isMatched = await this.ValidateHashPassword(password, user.password);

    if (!isMatched) throw new AppError(PASSWORD_MISSMATCHED, "Invalid password & email", 400);

    return user;
  }

  async ValidateCustomerLogin({ email, password }) {
    const user = await this.respository.FindCustomerBYEmailVerified({ email });

    if (!user.password) throw new AppError(PASSWORD_MISSMATCHED, "Please login with google", 400);

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

    if (code) {
      await this.mailService.sendOtpMail(user.email, code.otp);

      return code.otp;
    }

    const generatedCode = await this.CreateOtpCode(user._id);

    await this.mailService.sendOtpMail(user.email, generatedCode.otp);

    return generatedCode.otp;
  }

  async SendOtpPhone({ user }) {
    const code = await this.respository.OtpExist(user._id);

    if (code) {
      await this.mailService.sendOtpSms(user.phone, code.otp);

      return code.otp;
    }

    const generatedCode = await this.CreateOtpCode(user._id);

    await this.mailService.sendOtpSms(user.phone, generatedCode.otp);

    return generatedCode.otp;
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

  async CustomerCreateDB({ name, email, password, phone }) {
    return await this.respository.CustomerCreate({ name, email, password, phone });
  }

  async CreateCustomerZoho(user) {
    const { _id, email, phone, name } = user;

    const userData = await this.zohoService.CreateCustomer({ email, phone, name });

    const customerId = userData.contact.contact_id;

    return await this.respository.UpdateCustomer({ _id, customerId });
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

  async updateCustomerVerfiy({ _id }) {
    return await this.respository.updateCustomerVerfiy({ _id });
  }

  async CreateCustomer({ _id, email, name, password, image, phone, DOB, gender }) {
    if (!_id) {
      _id = new ObjectId();
    }

    const customerData = { email, name, password, image, phone, DOB, gender, verfiy: true };

    const filteredData = Object.fromEntries(Object.entries(customerData).filter(([key, value]) => value !== undefined && value !== 0));

    const user = await this.respository.CreateCustomer(_id, filteredData);

    await this.CreateCustomerZoho(user);

    const token = await this.GenerateSignedJwt(user);

    return token;
  }

  async CustomerSignup({ email }) {
    const user = await this.respository.FindCustomerByEmail({ email });

    const token = await this.GenerateSignedJwt(user);

    return token;
  }

  async CustomerCreate({ email, password }) {
    const data = await this.respository.CustomerCreate({ email, password });

    const token = await this.GenerateSignedJwt(data);

    return token;
  }

  async FindCustomerBYEmail({ email }) {
    return await this.respository.FindCustomerBYEmail({ email });
  }

  async FindCustomerBYPhone({ phone }) {
    return await this.respository.FindCustomerBYPhone({ phone });
  }

  async FindCustomerBYPhoneVerified({ phone }) {
    return await this.respository.FindCustomerBYPhoneVerified({ phone });
  }
}

export default UserHelper;
