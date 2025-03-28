import { MainCategory } from "../models/category.model.js";
import { Dietary } from "../models/dietary.mode.js";
import { SubCategory } from "../models/subCategory.model.js";
import mongoose, { Schema } from "mongoose";

class CategoryRepository {
  async CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }) {


    // Remove undefined fields except subCategory
    const filteredData = Object.fromEntries(
      Object.entries({ image, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory })
        .filter(([_, value]) => value !== undefined)
    );

    const updateQuery = { $set: filteredData };

    // Ensure subCategory is updated without duplicating entries
    if (subCategory && subCategory.length > 0) {
      updateQuery.$set["subCategory"] = subCategory;
    }

    return await MainCategory.findByIdAndUpdate(
      { _id },
      updateQuery,
      { upsert: true, new: true }
    );
  }



  async CreateSubCategory({ _id, title, level, parent }) {
    return await SubCategory.findByIdAndUpdate({ _id }, { title, level, parent }, { upsert: true, new: true });
  }

  async GetAllTheCategory() {
    return await MainCategory.aggregate([
      {
        $addFields: {
          subCategory: {
            $filter: {
              input: "$subCategory",
              as: "sub",
              cond: {
                $and: [
                  { $eq: ["$$sub.visible", true] },
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          subCategory: {
            $map: {
              input: "$subCategory",
              as: "sub",
              in: {
                $mergeObjects: [
                  "$$sub",
                  {
                    subCategory: {
                      $filter: {
                        input: "$$sub.subCategory",
                        as: "subSub",
                        cond: {
                          $and: [
                            { $eq: ["$$subSub.visible", true] },
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]);
  }


  async GetAllTheCategoryFilter() {
    return await MainCategory.find({ visibility: true }).select(" title ");
  }

  async GetNonFeaturedCategory() {
    return await MainCategory.find({ featuredCategory: false });
  }

  async GetAllFeaturedCategory() {
    return await MainCategory.aggregate([
      {
        $match: {
          visibility: true,
          disable: false,
          $or: [
            { featuredCategory: true }, // Top-level featured categories
            { "subCategory.featuredCategory": true },
            { "subCategory.visible": true }, // Subcategories with featuredCategory true
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
    return await MainCategory.updateOne({ _id: _id }, { $set: { disable: true, featuredCategory: false } });
  }

  async UpdateSubCategory({ parentId, _id, title, tag, description, featuredCategory, image }) {

    // Remove undefined fields
    const filteredData = Object.fromEntries(
        Object.entries({ title, tag, description, featuredCategory, image })
        .filter(([_, value]) => value !== undefined)
    );

    // First, check if subcategory exists
    const category = await MainCategory.findOne({ _id: parentId, "subCategory._id": _id });

    if (!category) {
        // If subCategory does not exist, push a new one
        return await MainCategory.findOneAndUpdate(
            { _id: parentId },
            { $push: { subCategory: { _id, ...filteredData } } }, // Add new subcategory
            { upsert: true, new: true }
        );
    }

    // If subCategory exists, update it
    return await MainCategory.findOneAndUpdate(
        { _id: parentId, "subCategory._id": _id },
        {
            $set: Object.fromEntries(
                Object.entries(filteredData).map(([key, value]) => [`subCategory.$.${key}`, value])
            )
        },
        { new: true }
    );
}


  async GetAllFeaturedCategoryAdmin() {
    const featuredCategories = await MainCategory.aggregate([
      {
        $match: {
          $or: [{ featuredCategory: true }, { "subCategory.featuredCategory": true }],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          featuredCategory: 1,
          publishDate: 1,
          subCategory: {
            $filter: {
              input: "$subCategory",
              as: "sub",
              cond: {
                $and: [
                  { $eq: ["$$sub.featuredCategory", true] },
                  { $eq: ["$$sub.visible", true] }
                ],
              },
            },
          },
        },
      },
    ]);

    // Transform and combine all featured categories into a single array
    const combinedFeatured = [];

    featuredCategories.forEach((category) => {
      // Add parent if it's featured
      if (category.featuredCategory) {
        combinedFeatured.push({
          _id: category._id,
          title: category.title,
          image: category.image,
          type: "parent",
          parentId: null,
          parentTitle: null,
          publishDate: category.publishDate,
        });
      }

      // Add featured subcategories
      if (category.subCategory && category.subCategory.length > 0) {
        const featuredSubs = category.subCategory.map((sub) => ({
          _id: sub._id,
          title: sub.title,
          image: sub.image,
          type: "child",
          parentId: category._id,
          parentTitle: category.title,
          publishDate: category.publishDate,
        }));
        combinedFeatured.push(...featuredSubs);
      }
    });

    // Sort by type (parents first) and then by title
    return combinedFeatured.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "parent" ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
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

  async GetDietary() {
    return await Dietary.find();
  }

  async CreateDietary({ _id, title }) {
    return await Dietary.findByIdAndUpdate({ _id }, { title }, { upsert: true, new: true });
  }
}

export default CategoryRepository;
