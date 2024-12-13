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
  check("category").optional(),

  // SubCategory, check validity (if present)
  check("subCategory").optional(),

  // Product (if present), check validity
  check("product").optional(),

  // Image, check validity
  check("image").notEmpty().withMessage("Image URL is mandatory").isString().withMessage("Image URL must be a string"),
];

// login sechme validation //
export const SchemaValidationForLogin = [
  // email , check validity
  check("email").trim().notEmpty().withMessage("Email Id is mandatory").isEmail().withMessage("Invalid email address"),

  // password , check validity
  check("password").notEmpty().withMessage("Password is mandatory").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

export const SchemaValidationForCategory = [
  // Title validation
  check("title").trim().notEmpty().withMessage("Title is mandatory").isString().withMessage("Title must be a string"),

  // Tag validation (optional field, but if provided, must be a string)
  check("tag").optional().isString().withMessage("Tag must be a string"),

  // Description validation
  check("description").trim().notEmpty().withMessage("Description is mandatory").isString().withMessage("Description must be a string"),

  // Visibility validation
  check("visibility").notEmpty().withMessage("Visibility is mandatory").isBoolean().withMessage("Visibility must be a boolean"),

  // Publish date validation
  check("publishDate").notEmpty().withMessage("Publish date is mandatory").isISO8601().withMessage("Publish date must be a valid ISO 8601 date"),

  // Maximum discount validation
  check("maximumDiscount").notEmpty().withMessage("Maximum discount is mandatory").isNumeric().withMessage("Maximum discount must be a number"),

  // Featured category validation
  check("featuredCategory").notEmpty().withMessage("Featured category is mandatory").isBoolean().withMessage("Featured category must be a boolean"),
];
