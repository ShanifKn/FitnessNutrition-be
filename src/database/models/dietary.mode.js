import mongoose, { Schema } from "mongoose";

const dietarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Dietary = mongoose.model("Dietary", dietarySchema);
