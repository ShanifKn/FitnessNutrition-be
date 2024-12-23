import { Product } from "../models/product.model.js";
import { ProductVariant } from "../models/variantProduct.model.js";

class ProductRepository {
  async FindProductById({ item_id }) {
    return await Product.findOne({ item_id });
  }

  async UpdataProduct({
    _id,
    item_id,
    actual_available_stock,
    name,
    rate,
    __v,
    account_id,
    account_name,
    available_stock,
    cf_classification,
    cf_classification_unformatted,
    cf_component_type,
    cf_component_type_unformatted,
    cf_movemet_measure,
    cf_movemet_measure_unformatted,
    cf_storage_condition,
    cf_storage_condition_unformatted,
    cf_usage_unit,
    cf_usage_unit_unformatted,
    createdAt,
    created_time,
    description,
    has_attachment,
    is_linked_with_zohocrm,
    is_taxable,
    item_name,
    item_type,
    last_modified_time,
    pending,
    product_type,
    purchase_account_id,
    purchase_account_name,
    purchase_description,
    purchase_rate,
    reorder_level,
    sku,
    source,
    status,
    stock_on_hand,
    tax_exemption_code,
    tax_exemption_id,
    tax_id,
    tax_name,
    tax_percentage,
    unit,
    updatedAt,
    zcrm_product_id,
    additionalDescription,
    chips,
    visibility,
    productCount,
    productPrice,
    images,
    maxDiscount,
    parentCategory,
    subCategory,
    category,
    analytics,
    paymentMethods,
    publishDate,
    variants,
    additionals,
    rating,
    dietary,
    size,
    colour,
    flavour,
    productBrand,
  }) {
    return await Product.updateOne(
      { item_id },
      {
        actual_available_stock,
        name,
        rate,
        account_id,
        account_name,
        available_stock,
        cf_classification,
        cf_classification_unformatted,
        cf_component_type,
        cf_component_type_unformatted,
        cf_movemet_measure,
        cf_movemet_measure_unformatted,
        cf_storage_condition,
        cf_storage_condition_unformatted,
        cf_usage_unit,
        cf_usage_unit_unformatted,
        createdAt,
        created_time,
        description,
        has_attachment,
        is_linked_with_zohocrm,
        is_taxable,
        item_name,
        item_type,
        last_modified_time,
        pending,
        product_type,
        purchase_account_id,
        purchase_account_name,
        purchase_description,
        purchase_rate,
        reorder_level,
        sku,
        source,
        status,
        stock_on_hand,
        tax_exemption_code,
        tax_exemption_id,
        tax_id,
        tax_name,
        tax_percentage,
        unit,
        updatedAt,
        zcrm_product_id,
        additionalDescription,
        chips,
        visibility,
        productCount,
        productPrice,
        images,
        maxDiscount,
        parentCategory,
        subCategory,
        category,
        analytics,
        paymentMethods,
        publishDate,
        variants,
        additionals,
        rating,
        dietary,
        size,
        colour,
        flavour,
        productBrand,
      },
      { upsert: true, new: true }
    );
  }

  async UpdateProducts(_id, updatedFields) {
    return await Product.updateOne({ _id: _id }, { $set: updatedFields });
  }

  async GetPendingProducts() {
    return await Product.find({ pending: true, status: "active" }).select("_id item_id actual_available_stock name rate status image"); // Adjust the fields you want from the category
  }

  async GetAllProduct() {
    return await Product.find().select("_id item_id actual_available_stock name rate status image size colour flavour ");
  }

  async GetProducts() {
    return await Product.find({ pending: false }).populate("category", "name");
  }

  async GetProductAll() {
    return await Product.find({ pending: false }).populate("category", "name");
  }

  async GetPendingCounts() {
    return await Product.countDocuments({ pending: true });
  }

  async GetProductDetails({ _id }) {
    return await Product.findOne({ _id }).populate("category", "name");
  }

  async CreateVaraintProduct({ item_id, products }) {
    return await ProductVariant.updateOne({ item_id }, { products }, { upsert: true, new: true });
  }

  async getVariant(_id) {
    return await ProductVariant.findOne({ item_id: _id })
      .populate("products.product_id") // Populate the product_id field in the products array
      .exec();
  }

  async CountUserByProduct(_id) {
    return await ProductVariant.countDocuments({ item_id: _id });
  }
}

export default ProductRepository;
