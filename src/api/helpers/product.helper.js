import CategoryRepository from "../../database/repositories/category.repositories.js";
import ProductRepository from "../../database/repositories/product.repositories.js";
import { ObjectId } from "mongodb";



class ProductHelper {
  constructor() {
    this.repository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async GetPendingProducts() {
    return await this.repository.GetPendingProducts();
  }

  async GetProducts({ page, limit }) {


    return await this.repository.GetProductForAdmin();

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
    const currentDate = new Date();

    const product = await this.repository.GetProducts({ currentDate });

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
    return await this.repository.GetAllProduct();
  }

  async CreateVaraintProduct({ item_id, products }) {
    return await this.repository.CreateVaraintProduct({ item_id, products });
  }

  async getVariant(_id) {
    return await this.repository.getVariant(_id);
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

  async getCategoryFilter({ categoryId }) {
    const currentDate = new Date();

    // Base query for categoryId
    const query = {};
    if (categoryId) {
      query.$or = [{ category: categoryId }, { subCategory: categoryId }, { parentCategory: categoryId }];
    }
    const allProducts = await this.repository.getTotalFilteredCount(currentDate, query);

    // Create arrays from all products
    const uniqueProductBrands = [...new Set(allProducts.map((product) => product.productBrand?.trim()).filter(Boolean))].sort();

    const uniqueDietaries = [...new Set(allProducts.flatMap((product) => product.dietary || []).filter(Boolean))].sort();

    const uniqueParentCategories = [
      ...new Map(
        allProducts
          .filter((product) => product.parentCategory) // Filter out null or undefined parentCategory
          .map((product) => [
            product.parentCategory._id, // Use _id as the key for uniqueness
            { _id: product.parentCategory._id, title: product.parentCategory.title },
          ])
      ).values(),
    ].sort((a, b) => a.title.localeCompare(b.title));

    return {
      productBrands: uniqueProductBrands,
      dietaries: uniqueDietaries,
      parentCategory: uniqueParentCategories,
    };
  }

  async getCategoryFilterProduct({ productBrands, parentCategory, dietary, page, limit, categoryId }) {
    const query = {};
    const currentDate = new Date();

    if (productBrands && productBrands.length > 0) {
      query.productBrand = { $in: productBrands }; // Match product brands in the array
    }
    if (parentCategory && parentCategory.length > 0) {
      query.parentCategory = { $in: parentCategory }; // Match parentCategory in the array
    }
    if (dietary && dietary.length > 0) {
      query.dietary = { $in: dietary }; // Match all dietary values
    }
    if (categoryId) {
      query.$or = [{ category: categoryId }, { subCategory: categoryId }, { parentCategory: categoryId }];
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

  async GetProductBestSellers() {
    const currentDate = new Date();

    const product = await this.repository.GetProducts({ currentDate });

    const lastedProdt = await this.repository.GetLastedProduct({ currentDate });

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

    const data = {
      newly: lastedProdt,
      featured: groupedProducts.RM,
      popular: groupedProducts.LDN,
    };

    return data;
  }

  async getProductsWithFilter({ productBrands, parentCategory, dietary, page, limit, categoryId }) {
    const currentDate = new Date();
    const query = {};

    if (productBrands && productBrands.length > 0) {
      query.productBrand = { $in: productBrands }; // Match product brands in the array
    }
    if (parentCategory && parentCategory.length > 0) {
      query.parentCategory = { $in: parentCategory }; // Match parentCategory in the array
    }
    if (dietary && dietary.length > 0) {
      query.dietary = { $in: dietary }; // Match all dietary values
    }
    if (categoryId) {
      query.$or = [{ category: categoryId }, { subCategory: categoryId }, { parentCategory: categoryId }];
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
      products,
      totalProducts,
      totalPages,
      currentPage: pageInt,
      pageSize: limitInt,
    };

    return data;
  }

  async ProductSearch({ query }) {
    let filter = {};

    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { productBrand: { $regex: query, $options: "i" } },
          { flavour: { $regex: query, $options: "i" } },
          { colour: { $regex: query, $options: "i" } },
          { chips: { $elemMatch: { $regex: query, $options: "i" } } }, // Partial match in chips array
          { dietary: { $elemMatch: { $regex: query, $options: "i" } } }, // Partial match in dietary array
        ],
      };
    }

    return await this.repository.ProductSearch(filter);
  }


  async RelatedProduct({ productId, categoryId }) {
    let data = []
    let products = [];

    data = await this.repository.getVariants({ _id: productId })

    if (!data) {
      data = await this.repository.RelatedProduct({ categoryId })
      products = data;
    } else {
      data.products.map(product => {


        // Push the merged object to products array
        products.push({
          ...product.product_id, // Spread existing product_id properties
          variantType: product.variantType, // Add variantType
          variants: product.variants // Add variants
        });
      });

    }
    return products;
  }


  async CreateComboProduct({ _id, products, title, description, rating, price, discount, image }) {

    if (!_id) {
      _id = new ObjectId();
    }
    return await this.repository.CreateComboProduct({ _id, products, title, description, rating, price, discount, image });
  }



  async GetComboProducts() {
    return await this.repository.GetComboProducts()
  }


  async GetComboProduct({ _id }) {
    return await this.repository.GetComboProduct({ _id })
  }
}

export default ProductHelper;
