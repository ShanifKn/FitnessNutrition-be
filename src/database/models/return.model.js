import mongoose, { Schema } from "mongoose";

const returnSchema = new mongoose.Schema(
      {

            userId: { type: Schema.Types.ObjectId, ref: "customer" },

            orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

            productId: { type: Schema.Types.ObjectId, required: true, ref: "Products" },

            quantity: { type: Number, required: true },

            email: { type: String, required: true },

            price: { type: Number, required: true },

            messages: { type: String },

            response: { type: String },

            request: { type: String, enum: ["Return", "Support"] },

            status: { type: String, default: "Request", enum: ["Declined", "Returned", "Request", "Accepted"] }

      },
      { timestamps: true }
);


export const Return = mongoose.model("return", returnSchema);
