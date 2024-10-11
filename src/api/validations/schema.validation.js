import { check } from "express-validator";

// banner sechme validation //
export const SchemaValidationForBanner = [
  // Title, check validity
  check("title").notEmpty().withMessage("Title is mandatory").isString().withMessage("Title must be a string"),

  // Banner Type, check validity
  check("bannerType").notEmpty().withMessage("Banner Type is mandatory").isString().withMessage("Banner Type must be a string"),

  // Visibility, check validity
  check("visibility").notEmpty().withMessage("Visibility is mandatory").isBoolean().withMessage("Visibility must be a boolean"),

  // Category, check validity
  check("category")
    .notEmpty()
    .withMessage("Category is mandatory")
    .isArray()
    .withMessage("Category must be an array of ObjectIds"),

  // SubCategory, check validity (if present)
  check("subCategory")
    .optional(),

  // Product (if present), check validity
  check("product").optional().isString().withMessage("Product must be a string"),

  // Image, check validity
  check("image").notEmpty().withMessage("Image URL is mandatory").isString().withMessage("Image URL must be a string"),
];
