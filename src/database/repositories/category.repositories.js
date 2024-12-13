import { MainCategory } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";

class CategoryRepository {
  async CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }) {
    
    return await MainCategory.findByIdAndUpdate({ _id }, { image, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }, { upsert: true, new: true });
  }

  async CreateSubCategory({ _id, title, level, parent }) {
    return await SubCategory.findByIdAndUpdate({ _id }, { title, level, parent }, { upsert: true, new: true });
  }

  async GetAllTheCategory() {
    return await MainCategory.find();
  }

  async GetNonFeaturedCategory() {
    return await MainCategory.find({ featuredCategory: false });
  }

  async GetAllFeaturedCategory() {
    return await MainCategory.find({ featuredCategory: true });
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
}

export default CategoryRepository;
