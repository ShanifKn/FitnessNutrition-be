import mongoose, { Schema } from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: { type: String },
    customerId: { type: String },
    password: { type: String },
    image: { type: String },
    phone: { type: Number, unique: true },
    DOB: { type: Date },
    gender: { type: String },
    verfiy: { type: Boolean, default: false },
    address: [
      {
        type: { type: String },
        flatno: { type: String },
        flatname: { type: String },
        street: { type: String },
        landMark: { type: String },
        pin: { type: Number },
        city: { type: String },
        country: { type: String },
        delivery: { type: Boolean },
      },
    ],
    expireAt: { type: Date, default: undefined }, // TTL field
  },
  { timestamps: true }
);

// Add TTL index for `expireAt`
customerSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Middleware to set `expireAt` dynamically based on `verfiy`
customerSchema.pre("save", function (next) {
  if (!this.verfiy) {
    // Set the `expireAt` field to 10 minutes from now if `verfiy` is false
    this.expireAt = new Date(Date.now() + 10 * 60 * 1000);
  } else {
    // Clear the `expireAt` field if `verfiy` is true
    this.expireAt = undefined;
  }
  next();
});

export const Customer = mongoose.model("customer", customerSchema);
