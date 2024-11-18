import mongoose, { Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user", unique: true },

  otp: { type: Number, required: true },
});


export const OtpSchem = mongoose.model("otp", otpSchema);
