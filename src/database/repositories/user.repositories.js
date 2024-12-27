import { Customer } from "../models/customer.model.js";
import { OtpSchem } from "../models/otp.model.js";
import { Users } from "../models/user.model.js";

class UserRepository {
  constructor() {}

  async CountUserByEmail({ email }) {
    return await Users.countDocuments({ email });
  }

  async CountCustomerByEmail({ email }) {
    return await Customer.countDocuments({ email });
  }

  async CountCustomerByPhone({ phone }) {
    return await Customer.countDocuments({ phone });
  }

  // find user by email  to get the user data
  async FindOneUserEmail({ email }) {
    return await Users.findOne({ email }).select("-createdAt -updatedAt -__v").lean();
  }

  async CreateUserOtp({ _id, generatedCode }) {
    return await OtpSchem.create({ userId: _id, otp: generatedCode });
  }

  async CreateNewUser({ email, password }) {
    return await Users.create({ email, password });
  }

  async VerifyOtp({ email, otp }) {
    return await OtpSchem.findOne({ email: email, otp: otp });
  }

  async OtpExist({ _id }) {
    return await OtpSchem.findOne({ userId: _id });
  }

  async CreateCustomer(_id, userData) {
    return await Customer.findOneAndUpdate({ _id }, { $set: userData }, { upsert: true, new: true }).select("name email image phone gender DOB ").lean();
  }

  async FindCustomerByEmail({ email }) {
    return await Customer.findOne({ email }).select("name email image phone gender DOB address").lean();
  }

  async CustomerCreate({ name, email, password, phone }) {
    const newCustomer = new Customer({
      name,
      email,
      password,
      phone,
    });

    return await newCustomer.save();
  }

  async FindCustomerBYEmail({ email }) {
    return await Customer.findOne({ email });
  }

  async FindCustomerBYPhone({ phone }) {
    return await Customer.findOne({ phone });
  }

  async UpdateCustomer({ _id, customerId }) {
    return await Customer.updateOne({ _id }, { $set: { customerId } });
  }
}
export default UserRepository;
