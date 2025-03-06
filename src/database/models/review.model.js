import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
      {

            userId: { type: Schema.Types.ObjectId, required: true, ref: "customer" },

            productId: { type: Schema.Types.ObjectId, ref: "Products", required: true, },

            orderId: { type: Schema.Types.ObjectId, ref: "Products", required: true },

            rating: { type: Number },

            review: { type: String }
      },
      { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
