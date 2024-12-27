import mongoose, { Schema } from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },

    name: { type: String },

    customerId: { type: String },

    password: { type: String },

    image: { type: String },

    phone: { type: Number },

    DOB: { type: Date },

    gender: { type: String },

    address: [{ type: { type: String }, flatno: { type: String }, flatname: { type: String }, street: { type: String }, landMark: { type: String }, pin: { type: Number }, city: { type: String }, country: { type: String }, delivery: { type: Boolean } }],
  },
  { timestamps: true }
);

export const Customer = mongoose.model("customer", customerSchema);
