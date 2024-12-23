import ProductHelper from "../api/helpers/product.helper.js";

class ProductService {
  constructor() {
    this.helper = new ProductHelper();
  }

  async GetPendingProducts() {
    return await this.helper.GetPendingProducts();
  }

  async GetProducts() {
    return await this.helper.GetProducts();
  }

  async GetPendingCounts() {
    return await this.helper.GetPendingCounts();
  }

  async GetProductDetails({ _id }) {
    return await this.helper.GetProductDetails({ _id });
  }

  async UpdateProduct(
    _id,
    item_id,
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
    productBrand
  ) {
    await this.helper.UpdateProducts(
      _id,
      item_id,
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
      productBrand
    );

    return { message: "Product has been updated and active" };
  }

  async GetProductToType() {
    return await this.helper.GetProductToType();
  }

  async GetAllProduct() {
    return await this.helper.GetAllProduct();
  }

  async CreateVaraintProduct({ item_id, products }) {
    return await this.helper.CreateVaraintProduct({ item_id, products });
  }

  async getVariant(_id) {
    return await this.helper.getVariant(_id);
  }
}

export default ProductService;
