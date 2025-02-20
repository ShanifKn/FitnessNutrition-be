import { Driver } from "../models/driver.model.js";

class DriverRepository {
  async createDriver({ password, image, name, email, phone, whatappPhone, branch, location, dlNo }) {
    const newDriver = new Driver({ password, image, name, email, phone, whatappPhone, branch, location, dlNo });

    return await newDriver.save();
  }

  async getDriverWithLimit({ pageInt, limitInt, skip }) {
    return await Driver.find().select("-password -__v")
      .skip(skip) // Skip the first 'skip' number of products
      .limit(limitInt)
      .lean();
  }

  async getDriverDetails({ _id }) {
    return await Driver.findOne({ _id });
  }

  async updateDriver({ _id, ...updateFields }) {
    return await Driver.findByIdAndUpdate(_id, updateFields, { new: true }).lean();
  }

  async CountUser({ email }) {
    return await Driver.countDocuments({ email });
  }

  async findUserByEmail({ email }) {
    return await Driver.findOne({ email });
  }

  async UpdatePassword({ email, password }) {
    return await Driver.updateOne({ email }, { $set: { password } });
  }
}

export default DriverRepository;
