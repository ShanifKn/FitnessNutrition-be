import mongoose, { Schema } from "mongoose";

const categoryLevel1 = new mongoose.Schema({
  image: { type: String },

  title: { type: String, required: true, unique: true },

  tag: { type: String },

  description: { type: String, required: true },

  visibility: { type: Boolean, required: true, default: false },

  publishDate: { type: Date, required: true },

  maximumDiscount: { type: Number, required: true },

  featuredCategory: { type: Boolean, required: true, default: false },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

  subCategory: [
    {
      title: { type: String, default: null }, // Allows null values
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      level: { type: Number, default: 1 },
      subCategory: [
        {
          title: { type: String, default: null }, // Allows null values
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
          level: { type: Number, default: 2 },
        },
      ],
    },
  ],
});

export const MainCategory = mongoose.model("MainCategory", categoryLevel1);
