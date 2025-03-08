import mongoose from "mongoose";
import { Driver } from "../models/driver.model.js";
import { OrderStatus } from "../models/orderStatus.model.js";
import { Orders } from "../models/order.model.js";

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
      { $match: { driverId: new mongoose.Types.ObjectId(driverId) } }, // Filter by driverId
      {
        $addFields: {
          highestStatus: {
            $max: {
              $map: {
                input: "$orderTimeline",
                as: "status",
                in: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$$status.status", "Delivered"] }, then: 3 },
                      { case: { $eq: ["$$status.status", "Dispatched"] }, then: 2 },
                      { case: { $eq: ["$$status.status", "Pick-up"] }, then: 1 }
                    ],
                    default: 0
                  }
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          highestStatusName: {
            $switch: {
              branches: [
                { case: { $eq: ["$highestStatus", 3] }, then: "Delivered" },
                { case: { $eq: ["$highestStatus", 2] }, then: "Dispatched" },
                { case: { $eq: ["$highestStatus", 1] }, then: "Pick-up" }
              ],
              default: null
            }
          }
        }
      },
      {
        $group: {
          _id: "$highestStatusName", // Group by the highest status per document
          count: { $sum: 1 } // Count occurrences
        }
      }
    ]);

    // Initialize the count structure
    const counts = {
      "Pick-up": 0,
      Dispatched: 0,
      Delivered: 0,
      totalOrders: 0 // Should match the actual number of documents
    };

    // Populate the response
    result.forEach(item => {
      counts[item._id] = item.count;
      counts.totalOrders += item.count; // This should match the actual number of documents
    });

    return counts;
  }

  async getDispatchedCODOrdersTotal({ driverId }) {
    const result = await OrderStatus.aggregate([
      {
        $match: { driverId: new mongoose.Types.ObjectId(driverId) } // Filter by driverId
      },
      {
        $unwind: "$orderTimeline" // Unwind the orderTimeline array 
      },
      {
        $match: { "orderTimeline.status": "Dispatched" } // Filter only Dispatched orders
      },
      {
        $lookup: {
          from: "orders", // Collection name where orderId refers to
          localField: "orderId",
          foreignField: "_id",
          as: "orderDetails"
        }
      },
      {
        $unwind: "$orderDetails" // Unwind populated orderId details
      },
      {
        $match: { "orderDetails.paymentMethod": "COD" } // Filter orders where paymentMethod is COD
      },
      {
        $group: {
          _id: null,
          totalCODAmount: { $sum: "$orderDetails.totalAmount" } // Sum the totalAmount field
        }
      }
    ]);

    return result.length > 0 ? result[0].totalCODAmount : 0; // Return total amount or 0 if no orders
  }


}

export default DriverRepository;
