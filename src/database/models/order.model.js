import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "customer" },

    billingInfo: {
      name: { type: String, required: true },
      phone: { type: Number, required: true },
      addresss: { type: String, required: true },
      city: { type: String, required: true },
    },

    product: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: "Products" },
        quantity: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: { type: String },
        name: { type: String },
        status: { type: String, default: "pending", enum: ["pending", "cancelled", "return", "delivered", "confirmed"] },
      },
    ],

    paymentMethod: { type: String, required: true },

    payment: { type: Boolean, default: false },

    reFund: { type: Boolean, default: false },

    shippingAddress: {},

    discountCoupon: { type: String },

    discountAmount: { type: Number },

    orderComfirmed: { type: String, default: "pending", enum: ["pending", "cancelled", "return", "delivered", "confirmed"] },

    total: { type: Number, required: true },

    itemsTotal: { type: Number, required: true },

    deliveryCharge: { type: Number, required: true },

    vat: { type: Number, required: true },

    salesorderId: { type: String },

    orderNumber: { type: String, unique: true },

    invoiceId: { type: String },

    remark: { type: String },

    payById: { type: String, default: null },
  },
  { timestamps: true }
);

// Pre-save middleware to generate a random order number
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const randomOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    this.orderNumber = randomOrderNumber;
  }
  next();
});

export const Orders = mongoose.model("Order", orderSchema);
