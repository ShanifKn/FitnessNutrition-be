import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({ email: { type: String, required: true, unique: true }, password: { type: String, required: true } }, { timestamps: true });

export const Users = mongoose.model("user", userSchema);
