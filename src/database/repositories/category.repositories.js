import { MainCategory } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import mongoose, { Schema } from "mongoose";

class CategoryRepository {
  async CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }) {
    return await MainCategory.findByIdAndUpdate({ _id }, { image, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }, { upsert: true, new: true });
  }

  async CreateSubCategory({ _id, title, level, parent }) {
    return await SubCategory.findByIdAndUpdate({ _id }, { title, level, parent }, { upsert: true, new: true });
  }

  async GetAllTheCategory() {
    return await MainCategory.find({ visibility: true });
  }

  async GetNonFeaturedCategory() {
    return await MainCategory.find({ featuredCategory: false });
  }

  async GetAllFeaturedCategory() {
    return await MainCategory.aggregate([
      {
        $match: {
          visibility: true,
          $or: [
            { featuredCategory: true }, // Top-level featured categories
            { "subCategory.featuredCategory": true }, // Subcategories with featuredCategory true
          ],
        },
      },
      {
        $project: {
          _id: 1, // Include top-level _id
          title: 1, // Include top-level title
          image: 1, // Include top-level image
          level: { $cond: { if: { $eq: ["$featuredCategory", true] }, then: 0, else: null } }, // Top-level level
          featuredCategory: { $cond: { if: { $eq: ["$featuredCategory", true] }, then: true, else: null } }, // Top-level featuredCategory
          subCategories: {
            $filter: {
              input: "$subCategory",
              as: "sub",
              cond: { $eq: ["$$sub.featuredCategory", true] }, // Filter featured subcategories
            },
          },
        },
      },
      {
        $project: {
          categories: {
            $concatArrays: [
              {
                $cond: {
                  if: { $eq: ["$featuredCategory", true] },
                  then: [
                    {
                      _id: "$_id",
                      title: "$title",
                      image: "$image",
                      level: 0,
                      featuredCategory: true,
                    },
                  ],
                  else: [],
                },
              },
              {
                $map: {
                  input: "$subCategories",
                  as: "sub",
                  in: {
                    _id: "$$sub._id",
                    title: "$$sub.title",
                    image: "$$sub.image",
                    level: 1,
                    featuredCategory: "$$sub.featuredCategory",
                  },
                },
              },
            ],
          },
        },
      },
      { $unwind: "$categories" }, // Flatten the array of combined categories
      {
        $replaceRoot: { newRoot: "$categories" }, // Replace the root with the flattened object
      },
    ]);
  }

  async GetCategoryDetails({ _id }) {
    return await MainCategory.findOne({ _id: _id });
  }

  async DeleteCategory({ _id }) {
    return await MainCategory.deleteOne({ _id: _id });
  }

  async UpdateSubCategory({ parentId, _id, title, tag, description, featuredCategory, image }) {
    return await MainCategory.findOneAndUpdate(
      { _id: parentId, "subCategory._id": _id },
      {
        $set: {
          "subCategory.$.title": title,
          "subCategory.$.description": description,
          "subCategory.$.tag": tag,
          "subCategory.$.featuredCategory": featuredCategory,
          "subCategory.$.image": image,
        },
      }
    );
  }

  async GetCategoryDetailForTitle({ _id }) {
  
    return await MainCategory.aggregate([
      // Match the main category, subcategory, or nested subcategory based on the provided _id
      {
        $match: {
          $or: [
            { _id: new mongoose.Types.ObjectId(_id) }, // Match main category by _id
            { "subCategory._id": new mongoose.Types.ObjectId(_id) }, // Match subcategory by _id
            { "subCategory.subCategory._id": new mongoose.Types.ObjectId(_id) }, // Match nested subcategory by _id
          ],
        },
      },
      // Project only the matched part (main category or subcategory)
      {
        $project: {
          _id: 1,
          title: 1,
          subCategory: {
            $cond: {
              if: { $eq: ["$subCategory._id", new mongoose.Types.ObjectId(_id)] }, // If subcategory matches
              then: "$subCategory", // Return the matched subcategory
              else: {
                $cond: {
                  if: { $eq: ["$subCategory.subCategory._id", new mongoose.Types.ObjectId(_id)] }, // If nested subcategory matches
                  then: "$subCategory.subCategory", // Return the matched nested subcategory
                  else: null,
                },
              },
            },
          },
        },
      },
      // Remove null subcategories (those that don't match)
    ]);
  }
  
  
  
}

export default CategoryRepository;
