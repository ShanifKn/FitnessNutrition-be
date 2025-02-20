import mongoose, { Schema } from "mongoose";

const deliverySchema = new mongoose.Schema({

  orderId: { type: Schema.Types.ObjectId, ref: "Order" },

  status: { type: String, default: "pending", enum: ["pending", "cancelled", "return", "delivered"] },

  
});
