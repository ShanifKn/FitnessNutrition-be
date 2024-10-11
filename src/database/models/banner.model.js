import mongoose, { Schema } from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    bannerType: { type: String, required: true },

    visibility: { type: Boolean, required: true },

    category: [{ type: Schema.Types.ObjectId, required: true }],

    subCategory: [{ type: Schema.Types.ObjectId }],

    product: { type: Schema.Types.String },

    image: { type: String, required: true },

    expDate: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

export const BannerModel = mongoose.model("Banner", bannerSchema);
