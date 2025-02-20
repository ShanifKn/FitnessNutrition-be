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
    return await Product.find({ pending: true }).select("_id item_id actual_available_stock name rate status images"); // Adjust the fields you want from the category
  }

  async GetAllProduct() {
    return await Product.find().select("_id item_id actual_available_stock name rate status images size colour flavour ");
  }

  async GetProducts({ currentDate }) {
    return await Product.find({ pending: false, publishDate: { $lt: currentDate } })
      .populate("category", "name")
      .limit(15);
  }

  async GetProductForAdmin() {
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

  async getProductCount(currentDate, filter) {
    return await Product.countDocuments({ ...filter, pending: false, publishDate: { $lt: currentDate } });
  }

  async getProductWithLimit({ currentDate, skip, limitInt, filter = {} }) {
    return await Product.find({
      ...filter, // Apply the dynamic filter (for category or other fields)
      pending: false,
      publishDate: { $lt: currentDate },
    })
      .skip(skip) // Skip the first 'skip' number of products
      .limit(limitInt) // Limit to the specified number of products
      .select("_id name rate rating maxDiscount images stock_on_hand  dietary productBrand ") // Select specific fields to return
      .populate("parentCategory", " title ")
      .exec();
  }

  async getAllProducts(currentDate, query) {
    const [metadata] = await Product.aggregate([
      {
        $match: {
          ...query,
          pending: false,
          publishDate: { $lt: currentDate },
        },
      },
      {
        $facet: {
          // Get unique product brands
          productBrands: [{ $match: { productBrand: { $exists: true, $ne: null } } }, { $group: { _id: { $trim: { input: "$productBrand" } } } }, { $match: { _id: { $ne: "" } } }, { $project: { _id: 0, brand: "$_id" } }],
          // Get unique dietary restrictions
          dietaries: [{ $unwind: "$dietary" }, { $match: { dietary: { $exists: true, $ne: null } } }, { $group: { _id: "$dietary" } }, { $project: { _id: 0, dietary: "$_id" } }],
          // Get unique parent categories
          parentCategories: [
            {
              $lookup: {
                from: "categories", // Adjust based on your actual collection name
                localField: "parentCategory",
                foreignField: "_id",
                as: "parentCat",
              },
            },
            { $unwind: "$parentCat" },
            { $group: { _id: "$parentCat.title" } },
            { $match: { _id: { $exists: true, $ne: null } } },
            { $project: { _id: 0, category: "$_id" } },
          ],
        },
      },
    ]);

    return {
      productBrand: metadata.productBrands.map((item) => item.brand),
      dietaries: metadata.dietaries.map((item) => item.dietary),
      parentCategorie: metadata.parentCategories.map((item) => item.category),
    };
  }

  async ProductDetails(productId) {
    return await Product.findOne({ _id: productId }).select(" rate rating images ");
  }

  async GetBrandName() {
    return await Product.find().select(" productBrand ");
  }

  async GetCategoryFilterProducts({ query, skip, limitInt, currentDate }) {
    return await Product.find({
      ...query,
      pending: false,
      publishDate: { $lt: currentDate },
    })
      .skip(skip)
      .limit(limitInt)
      .select("_id name rate rating maxDiscount images stock_on_hand ") // Select specific fields to return
      .populate("parentCategory", " title ")
      .exec();
  }

  async GetLastedProduct({ currentDate }) {
    return await Product.find({
      pending: false,
      publishDate: { $lt: currentDate },
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .select("_id name rate rating maxDiscount images stock_on_hand "); // Select specific fields to return
  }

  async getTotalFilteredCount(currentDate, query) {
    return await Product.find({ ...query, pending: false, publishDate: { $lt: currentDate } })
      .populate("parentCategory")
      .select("productBrand dietary parentCategory")
      .lean();
  }

  async ProductSearch(filter) {
    return await Product.find(filter).limit(5);
  }

}

export default ProductRepository;
