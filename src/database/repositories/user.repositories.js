import { Customer } from "../models/customer.model.js";
import { OtpSchem } from "../models/otp.model.js";
import { Users } from "../models/user.model.js";
import mongoose, { Schema } from "mongoose";

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

  async updateCustomerVerfiy(_id) {
    return await Customer.updateOne({ _id }, { $set: { verfiy: true } });
  }

  async FindCustomerBYEmail({ email }) {
    return await Customer.findOne({ email });
  }
  async FindCustomerBYEmailVerified({ email }) {
    return await Customer.findOne({ email, verfiy: true });
  }

  async FindCustomerBYPhoneVerified({ phone }) {
    return await Customer.findOne({ phone, verfiy: true });
  }

  async FindCustomerBYPhone({ phone }) {
    return await Customer.findOne({ phone });
  }

  async UpdateCustomer({ _id, customerId }) {
    return await Customer.updateOne({ _id }, { $set: { customerId } });
  }

  async CreateAddress({ userId, _id, type, flatno, flatname, street, landMark, pin, city, country, delivery }) {
    const addressData = {
      _id, // Generate a new _id if not provided
      type,
      flatno,
      flatname,
      street,
      landMark,
      pin,
      city,
      country,
      delivery,
    };

    const user = await Customer.findOne({ _id: userId });

    const addressExists = user.address.some((addr) => addr._id.toString() === _id?.toString());

    if (addressExists) {
      // Update the existing address
      await Customer.updateOne(
        { _id: new mongoose.Types.ObjectId(userId), "address._id": _id },
        { $set: { "address.$": addressData } } // Update the matched address
      );
    } else {
      // Add the new address
      await Customer.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $push: { address: addressData } } // Push the new address to the array
      );
    }

    return await Customer.findOne({ _id: userId }).select("address");
  }

  async GetUserDetails({ userId }) {

    return await Customer.findOne({ _id: userId }).select(" -password -createdAt -updatedAt -__v");
  }

  async GetUserData({ user }) {
    return await Customer.findOne({ _id: user }).select(" -password -createdAt -updatedAt -__v");
  }



  async DeleteAddress({ userId, _id }) {
    return await Customer.updateOne(
      { _id: userId }, // Filter to find the user by their ID
      { $pull: { address: { _id } } } // Remove the address with the matching _id
    );
  }

  async DeliveryAddress({ userId, _id }) {
    await Customer.updateOne(
      { _id: userId },
      { $set: { "address.$[].delivery": false } } // Update all delivery fields in the address array
    );

    await Customer.updateOne(
      {
        _id: userId, // Ensure userId is an ObjectId
        "address._id": new mongoose.Types.ObjectId(_id), // Ensure address._id is an ObjectId
      },
      { $set: { "address.$.delivery": true } } // Update the matching address
    );

    return await Customer.findOne({ _id: userId }).select("address");
  }

  async UpdateUser({ userId, email, name, image, phone, dob, gender }) {
    const updateData = {
      ...(email && { email }),
      ...(name && { name }),
      ...(image && { image }),
      ...(phone && { phone }),
      ...(dob && { dob }),
      ...(gender && { gender }),
    };

    return await Customer.updateOne(
      { _id: userId }, // Match the user by userId
      { $set: updateData }, // Set the fields to be updated
      { runValidators: true } // Ensures validation is applied
    );
  }
}
export default UserRepository;
