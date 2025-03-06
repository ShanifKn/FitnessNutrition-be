import mongoose, { Schema } from "mongoose";

const comboSchema = new mongoose.Schema({

      products: [
            {
                  productId: {
                        type: Schema.Types.ObjectId,
                        ref: "Products",
                        required: true,
                  },
                  quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                  },
                  price: {
                        type: Number,
                        required: true,
                  },
                  total: {
                        type: Number,
                        required: true,
                  },

            },
      ],

      title: { type: String, unique: true },

      description: { type: String },

      rating: { type: Number },

      price: { type: Number },

      discount: { type: Number },

      image: { type: String }
},
      { timestamps: true }
);


export const ComboModel = mongoose.model("ComboProduct", comboSchema);
