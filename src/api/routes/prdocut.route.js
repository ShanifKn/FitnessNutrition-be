import ProductService from "../../services/product.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import ExistCheck from "../validations/existCheck.js";
import Validate from "../validations/validator.js";

const ProductRouter = (app) => {
  const service = new ProductService();
  const existCheck = new ExistCheck();

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
      const { page, limit } = req.query;

      const data = await service.GetProducts({ page, limit });

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
    Authentication,
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
        dietary,
        size,
        colour,
        flavour,
        productBrand,
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
        rating,
        dietary,
        size,
        colour,
        flavour,
        productBrand
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

  // @route GET /
  // @des get product by category
  // @access private
  app.get(
    "/product-best",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetProductBestSellers();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product details
  // @access private
  app.get(
    "/allProducts",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetAllProduct();

      return res.status(200).json({ data });
    })
  );

  // @route CREATE /
  // @des add varaint products
  // @access private
  app.post(
    "/createVaraint",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { item_id, products } = req.body;

      const data = await service.CreateVaraintProduct({ item_id, products });

      return res.status(200).json({ data, message: "Variant added" });
    })
  );

  // @route GET /
  // @des  get variant by product id
  // @access private
  app.get(
    "/variants/:_id",
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      await existCheck.ForProduct(_id);

      const data = await service.getVariant(_id);

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.get(
    "/products",
    Validate,
    tryCatch(async (req, res) => {
      const { page = 1, limit = 10, categoryId = "" } = req.query;

      const data = await service.getProductWithLimit({ page, limit, categoryId });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.get(
    "/shop-filter",
    Validate,
    tryCatch(async (req, res) => {
      const { categoryId = "" } = req.query;

      const data = await service.getCategoryFilter({ categoryId });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.post(
    "/product-filter",
    Validate,
    tryCatch(async (req, res) => {
      const { productBrands, parentCategory, dietary, categoryId, page = 1, limit = 10 } = req.body;

      const data = await service.getCategoryFilterProduct({ productBrands, parentCategory, dietary, page, limit, categoryId });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.get(
    "/lasted-products",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetLastedProduct();

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/getProducts",
    Validate,
    tryCatch(async (req, res) => {
      const { page = 1, limit = 10, categoryId = "" } = req.query;

      const { productBrands, parentCategory, dietary } = req.body;

      const data = await service.getProductsWithFilter({ productBrands, parentCategory, dietary, page, limit, categoryId });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product details
  // @access private
  app.get(
    "/products/search",
    Validate,
    tryCatch(async (req, res) => {
      const { query } = req.query;

      const data = await service.ProductSearch({ query });

      return res.status(200).json({ data });
    })
  );



  // @route GET /
  // @des get product details
  // @access private
  app.post(
    "/products/relatedproducts",
    Validate,
    tryCatch(async (req, res) => {

      const { productId, categoryId } = req.body;

      const data = await service.RelatedProduct({ productId, categoryId });

      return res.status(200).json({ data });
    })
  );





  // @route POST /
  // @des get create combo product
  // @access private
  app.post(
    "/products/create-combo",
    Validate,
    tryCatch(async (req, res) => {

      const { _id, products, title, description, rating, price, discount, image } = req.body;

      const data = await service.CreateComboProduct({ _id, products, title, description, rating, price, discount, image });

      return res.status(200).json({ data });
    })
  );



  app.get(
    "/products/combos",
    Validate,
    tryCatch(async (req, res) => {

      const data = await service.GetComboProducts();

      return res.status(200).json({ data });
    })
  );


  app.get(
    "/products/combos/_id",
    Validate,
    tryCatch(async (req, res) => {

      const { _id } = req.params

      const data = await service.GetComboProduct({ _id });

      return res.status(200).json({ data });
    })
  );



};

export default ProductRouter;
