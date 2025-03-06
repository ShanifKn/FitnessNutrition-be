import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },

    orderTimeline: [
      {
        status: { type: String, enum: ["Order Confirmed", "Pick-up", "Dispatched", "Delivered", "Pending", "Cancelled"], required: true },
        date: { type: Date },
        time: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],

    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
  },
  { timestamps: true }
);

export const OrderStatus = mongoose.model("orderStatus", orderSchema);
