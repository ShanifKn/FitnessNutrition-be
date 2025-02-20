import mongoose, { Schema } from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },

    password: { type: String, required: true },

    name: { type: String },

    image: { type: String },

    phone: { type: Number, unique: true, required: true },

    whatappPhone: { type: Number, unique: true, required: true },

    branch: { type: String },

    location: { type: String },

    dlNo: { type: String, unique: true, required: true },

    active: { type: Boolean, default: true },

  },
  { timestamps: true }
);

export const Driver = mongoose.model("Driver", driverSchema);
