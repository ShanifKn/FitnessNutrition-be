import { BASE_URL } from "../../config/index.js";
import CategoryService from "../../services/category.service.js";
import { convertToWebP, uploadSingleImage } from "../../services/image.service.js";

import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import { SchemaValidationForCategory } from "../validations/schema.validation.js";
import Validate from "../validations/validator.js";

const CategoryRouter = (app) => {
  const service = new CategoryService();

  // @route POST /
  // @desc create new category
  // @access private
  // @fileds
  app.post(
    "/create-category",
    Authentication,
    SchemaValidationForCategory,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory, image } = req.body;

      const data = await service.CreateCategory({ _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory, image });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/image-upload",
    uploadSingleImage,
    convertToWebP,
    Validate,
    tryCatch(async (req, res) => {
      const image = req.file ? req.file.filename : null;

      const url = `${BASE_URL}/${image}`;

      return res.status(200).json({ url });
    })
  );

  //@route POST/
  //@desc create a sub category
  //@access private
  app.post(
    "/create-SubCat",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, title, level, parent } = req.body;

      const data = await service.CreateSubCategory({ _id, title, level, parent });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get all the categories
  //@access private
  app.get(
    "/category",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetAllTheCategory();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  categories details
  //@access private
  app.get(
    "/category/:id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const _id = req.params.id;

      const data = await service.GetCategoryDetails({ _id });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  categories details for shop
  //@access private
  app.get(
    "/category-title/:id",
    Validate,
    tryCatch(async (req, res) => {
      const _id = req.params.id;

      const data = await service.GetCategoryDetailForTitle({ _id });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  NonFeatured category all
  //@access private
  app.get(
    "/non-category",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetNonFeaturedCategory();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  Featured category all
  //@access public
  app.get(
    "/featured-category",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetAllFeaturedCategory();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  Featured category all
  //@access public
  app.get(
    "/featured-category-admin",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetAllFeaturedCategoryAdmin();

      return res.status(200).json({ data });
    })
  );

  // @route DELETE /
  //@desc delete a category
  //@access private
  app.delete(
    "/category/:id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const _id = req.params.id;

      const { message } = await service.DeleteCategory({ _id });

      return res.status(200).json({ message });
    })
  );

  // @route PATCH /
  //@desc update sub category
  //@access private
  app.patch(
    "/create-category",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { parentId, _id, title, tag, description, featuredCategory, image } = req.body;

      const { message } = await service.UpdateSubCategory({ parentId, _id, title, tag, description, featuredCategory, image });

      return res.status(200).json({ message });
    })
  );

  // @route GET /
  //@desc get  Featured category all
  //@access public
  app.get(
    "/dietary",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetDietary();

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  //@desc get  Featured category all
  //@access public
  app.post(
    "/dietary",
    Validate,
    tryCatch(async (req, res) => {
      const { _id, title } = req.body;


      const data = await service.CreateDietary({ _id, title });

      return res.status(200).json({ data });
    })
  );
};

export default CategoryRouter;
