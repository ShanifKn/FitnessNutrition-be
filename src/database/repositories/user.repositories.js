import { OtpSchem } from "../models/otp.model.js";
import { Users } from "../models/user.model.js";

class UserRepository {
  constructor() {}

  async CountUserByEmail({ email }) {
    return await Users.countDocuments({ email });
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
}
export default UserRepository;
