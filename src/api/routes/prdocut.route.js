import ProductService from "../../services/product.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import Validate from "../validations/validator.js";

const ProductRouter = (app) => {
  const service = new ProductService();

  // @route   GET /
  // @des     get all a pending products
  // @access  Private
  app.get(
    "/get-pending",
    // Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetPendingProducts();

      return res.status(200).json({ data });
    })
  );

  // @route   GET /
  // @des     get all a pending products
  // @access  Public
  app.get(
    "/get-products",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetProducts();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product pending count
  // @access private
  app.get(
    "/get-count",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetPendingCounts();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product details
  // @access private
  app.get(
    "/product/:_id",
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const data = await service.GetProductDetails({ _id });

      return res.status(200).json({ data });
    })
  );

  // @route   GET /
  // @des     update product items
  // @access  Private
  app.post(
    "/updateProduct",
    // Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const {
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
      } = req.body;

      const { message } = await service.UpdateProduct(
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
        rating
      );

      return res.status(200).json({ message });
    })
  );

  // @route GET /
  // @des get product by category
  // @access private
  app.get(
    "/product-homepage",
    Validate,
    tryCatch(async (req, res) => {
      const { NY, RM } = await service.GetProductToType();

      return res.status(200).json({ NY, RM });
    })
  );
};

export default ProductRouter;
