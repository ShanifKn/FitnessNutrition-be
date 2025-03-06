import mongoose, { Schema } from "mongoose";

const deliverySchema = new mongoose.Schema({

  userId: { type: Schema.Types.ObjectId, ref: "user" },

  deliveryCharge: { type: Number },

});


export const DeliveryCharge = mongoose.model("DLCharge", deliverySchema);
