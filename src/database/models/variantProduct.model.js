import mongoose, { Schema } from "mongoose";

const ItemsSchema = new mongoose.Schema(
  {
    item_id: { type: Schema.Types.ObjectId, required: true, ref: "Products" },

    products: [{ product_id: { type: Schema.Types.ObjectId, required: true, ref: "Products", unique: true }, variantType: { type: String, required: true }, variants: { type: String, required: true } }],
  },
  { timestamps: true }
);

export const ProductVariant = mongoose.model("ProductVariant", ItemsSchema);
