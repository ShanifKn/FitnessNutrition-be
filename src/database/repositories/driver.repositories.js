import { Driver } from "../models/driver.model.js";
import { OrderStatus } from "../models/orderStatus.model.js";

class DriverRepository {
  async createOrUpdateDriver({ password, image, name, email, phone, whatappPhone, branch, location, dlNo }) {
    // Check if a driver exists with the given email or phone number
    let existingDriver = await Driver.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingDriver) {
      // If found, update the existing driver
      existingDriver.password = password;
      existingDriver.image = image;
      existingDriver.name = name;
      existingDriver.whatappPhone = whatappPhone;
      existingDriver.branch = branch;
      existingDriver.location = location;
      existingDriver.dlNo = dlNo;

      return await existingDriver.save();
    } else {
      // Otherwise, create a new driver
      const newDriver = new Driver({ password, image, name, email, phone, whatappPhone, branch, location, dlNo });
      return await newDriver.save();
    }
  }

  async getDriverWithLimit({ pageInt, limitInt, skip }) {
    return await Driver.find().select(" -password -__v")
      .skip(skip) // Skip the first 'skip' number of products
      .limit(limitInt)
      .lean();
  }

  async getDriverDetails({ _id }) {
    return await Driver.findOne({ _id }).select(" -password -__v");
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

  async getDriverOrderCount({ driverId }) {
    const result = await OrderStatus.aggregate([
      {
        $match: {
          driverId: new mongoose.Types.ObjectId(driverId), // Ensure driverId is ObjectId
          "orderTimeline.status": { $in: ["Delivered", "Order Confirmed", "Dispatched"] },
        },
      },
      {
        $count: "totalOrders",
      },
    ]);

    return result.length > 0 ? result[0].totalOrders : 0;
  }
}

export default DriverRepository;
