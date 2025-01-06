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

// Middleware for dynamic `expireAt` updates
customerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update && update.verfiy !== undefined) {
    if (update.verfiy) {
      this.setUpdate({ ...update, expireAt: undefined });
    } else {
      this.setUpdate({
        ...update,
        expireAt: new Date(Date.now() + 10 * 60 * 1000),
      });
    }
  }
  next();
});

export const Customer = mongoose.model("customer", customerSchema);
