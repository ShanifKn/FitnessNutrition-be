import CategoryRepository from "../../database/repositories/category.repositories.js";
import ProductRepository from "../../database/repositories/product.repositories.js";

class ProductHelper {
  constructor() {
    this.repository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async GetPendingProducts() {
    return await this.repository.GetPendingProducts();
  }

  async GetProducts() {
    return await this.repository.GetProducts();
  }

  async GetPendingCounts() {
    return await this.repository.GetPendingCounts();
  }

  async GetProductDetails({ _id }) {
    return await this.repository.GetProductDetails({ _id });
  }

  async UpdateProduct(
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
    dietary
  ) {
    return await this.repository.UpdataProduct({
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
    });
  }

  async UpdateProducts(
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
    const productData = {
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
      pending: status === "inactive", // Set pending to true if status is inactive
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
    };

    const filteredProductData = Object.fromEntries(Object.entries(productData).filter(([key, value]) => value !== undefined));

    // Pass the filtered data to the helper function
    return await this.repository.UpdateProducts(_id, filteredProductData);
  }

  async GetProductToType() {
    const product = await this.repository.GetProducts();

    const groupedProducts = product.reduce((result, product) => {
      // Assuming `analytics` is an array of strings
      product.analytics.forEach((analytic) => {
        if (!result[analytic]) {
          result[analytic] = [];
        }
        result[analytic].push(product);
      });
      return result;
    }, {});

    return groupedProducts;
  }

  async GetAllProduct() {
    return this.repository.GetAllProduct();
  }

  async CreateVaraintProduct({ item_id, products }) {
    return this.repository.CreateVaraintProduct({ item_id, products });
  }

  async getVariant(_id) {
    return this.repository.getVariant(_id);
  }

  async getProductWithLimit({ pageInt, limitInt, skip, categoryId }) {
    const currentDate = new Date();

    // Define the filter conditionally
    const filter = categoryId
      ? {
          $or: [{ category: categoryId }, { subCategory: categoryId }, { parentCategory: categoryId }],
        }
      : {}; // If no categoryId is provided, return all products

    // Fetch the total number of products based on the filter
    const totalProducts = await this.repository.getProductCount(currentDate, filter);

    // Fetch the paginated products based on the filter
    const products = await this.repository.getProductWithLimit({
      currentDate,
      skip,
      limitInt,
      filter,
    });

    const totalPages = Math.ceil(totalProducts / limitInt);

    const data = {
      data: products,
      totalProducts,
      totalPages,
      currentPage: pageInt,
      pageSize: limitInt,
    };

    return data;
  }

  async getCategoryFilter() {
    let data = {};

    const catgory = await this.categoryRepository.GetAllTheCategoryFilter();

    const dietary = await this.categoryRepository.GetDietary();

    const brand = await this.repository.GetBrandName();

    const brandCount = {};
    for (const item of brand) {
      const brandName = item.productBrand?.trim(); // Remove trailing spaces if any
      if (brandName) {
        brandCount[brandName] = (brandCount[brandName] || 0) + 1;
      }
    }

    // Step 2: Filter brands that occur more than three times
    const uniqueBrands = [];
    const seenBrands = new Set();

    for (const item of brand) {
      const brandName = item.productBrand?.trim();
      if (brandName && brandCount[brandName] > 3 && !seenBrands.has(brandName)) {
        uniqueBrands.push(item); // Add the first occurrence of the brand
        seenBrands.add(brandName);
      }
    }

    data = {
      category: catgory,
      dietary: dietary,
      brand: uniqueBrands,
    };

    return data;
  }

  async getCategoryFilterProduct({ productBrands, parentCategory, dietary, page, limit }) {
    const query = {};
    const currentDate = new Date();

    console.log(productBrands, dietary);

    if (productBrands && productBrands.length > 0) {
      query.productBrand = { $in: productBrands }; // Match product brands in the array
    }
    if (parentCategory && parentCategory.length > 0) {
      query.parentCategory = { $in: parentCategory }; // Match parentCategory in the array
    }
    if (dietary && dietary.length > 0) {
      query.dietary = { $in: dietary }; // Match all dietary values
    }

    // Pagination calculations
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    const totalProducts = await this.repository.getProductCount(currentDate, query);

    const products = await this.repository.GetCategoryFilterProducts({ query, skip, limitInt, currentDate });

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limitInt);

    // Response
    const data = {
      data: products,
      totalProducts,
      totalPages,
      currentPage: pageInt,
      pageSize: limitInt,
    };

    return data;
  }

  async GetLastedProduct() {
    const currentDate = new Date();

    return await this.repository.GetLastedProduct({ currentDate });
  }
}

export default ProductHelper;
