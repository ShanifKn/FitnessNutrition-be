import mongoose, { Schema } from "mongoose";

// OTP schema definition
const otpSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user", unique: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
});

// Add TTL index on the createdAt field (10 minutes = 600 seconds)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const OtpSchem = mongoose.model("otp", otpSchema);
