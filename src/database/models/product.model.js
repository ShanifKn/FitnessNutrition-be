import mongoose, { Schema } from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    item_id: { type: String, required: true },
    name: { type: String, required: true },
    item_name: { type: String },
    unit: { type: String },
    status: { type: String },
    source: { type: String },
    is_linked_with_zohocrm: { type: Boolean },
    zcrm_product_id: { type: String },
    description: { type: String },
    rate: { type: Number, required: true },
    tax_id: { type: String },
    tax_name: { type: String },
    tax_percentage: { type: Number },
    purchase_account_id: { type: String },
    purchase_account_name: { type: String },
    account_id: { type: String },
    account_name: { type: String },
    purchase_description: { type: String },
    purchase_rate: { type: Number },
    item_type: { type: String },
    product_type: { type: String },
    is_taxable: { type: Boolean },
    tax_exemption_id: { type: String },
    tax_exemption_code: { type: String },
    stock_on_hand: { type: Number, default: 0 },
    has_attachment: { type: Boolean },
    available_stock: { type: Number, default: 0 },
    actual_available_stock: { type: Number, default: 0 },
    sku: { type: String },
    reorder_level: { type: String },
    created_time: { type: Date, required: true },
    last_modified_time: { type: Date, required: true },
    cf_movemet_measure: { type: String },
    cf_movemet_measure_unformatted: { type: String },
    cf_storage_condition: { type: String },
    cf_storage_condition_unformatted: { type: String },
    cf_classification: { type: String },
    cf_classification_unformatted: { type: String },
    cf_component_type: { type: String },
    cf_component_type_unformatted: { type: String },
    cf_usage_unit: { type: String },
    cf_usage_unit_unformatted: { type: String },

    parentCategory: { type: Schema.Types.ObjectId },

    subCategory: { type: Schema.Types.ObjectId },

    category: { type: Schema.Types.ObjectId },

    images: [{ type: String, default: [null, null, null, null] }],

    chips: [{ type: String }],

    additionalDescription: { type: String },

    additionals: [{ key: { type: String }, value: { type: String } }],

    variants: [{ variant: { type: String }, size: { type: String }, availableStock: { type: Number } }],

    analytics: [{ type: String }],

    paymentMethods: [{ type: String }],

    dietary: [{ type: String }],

    publishDate: { type: Date },

    maxDiscount: { type: Number },

    pending: { type: Boolean, default: true },

    rating: { type: Number },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Products", ItemSchema);
