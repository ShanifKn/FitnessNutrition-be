import mongoose, { Schema } from "mongoose";

const subCategory = new mongoose.Schema({
  title: { type: String, required: true, unique: true },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

  level: { type: Number, required: true, default: 2 },

  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, required: true },
});

export const SubCategory = mongoose.model("SubCategory", subCategory);
