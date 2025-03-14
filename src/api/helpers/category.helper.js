import CategoryRepository from "../../database/repositories/category.repositories.js";
import { ObjectId } from "mongodb";

class CategoryHelper {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }) {
    if (!_id) {
      _id = new ObjectId();
    }

    return await this.categoryRepository.CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory });
  }

  async CreateSubCategory({ _id, title, level, parent }) {
    if (!_id) {
      _id = new ObjectId();
    }

    return await this.categoryRepository.CreateSubCategory({ _id, title, level, parent });
  }

  async GetAllTheCategory() {
    return await this.categoryRepository.GetAllTheCategory();
  }

  async GetCategoryDetails({ _id }) {
    return await this.categoryRepository.GetCategoryDetails({ _id });
  }

  async GetNonFeaturedCategory() {
    return await this.categoryRepository.GetNonFeaturedCategory();
  }

  async GetAllFeaturedCategory() {
    return await this.categoryRepository.GetAllFeaturedCategory();
  }

  async DeleteCategory({ _id }) {
    const deleted = await this.categoryRepository.DeleteCategory({ _id });

    return { message: "Category deleted successfully" };
  }

  async UpdateSubCategory({ parentId, _id, title, tag, description, featuredCategory, image }) {

    if (!_id) {
      _id = new ObjectId();
    }

    await this.categoryRepository.UpdateSubCategory({ parentId, _id, title, tag, description, featuredCategory, image });


    return { message: "Sub category is added!" };

  }

  async GetCategoryDetailForTitle({ _id }) {
    return await this.categoryRepository.GetCategoryDetailForTitle({ _id });
  }

  async GetAllFeaturedCategoryAdmin() {
    return await this.categoryRepository.GetAllFeaturedCategoryAdmin();
  }

  async GetDietary() {
    return await this.categoryRepository.GetDietary();
  }

  async CreateDietary({ _id, title }) {
    if (!_id) {
      _id = new ObjectId();
    }

    return await this.categoryRepository.CreateDietary({ _id, title });
  }
}

export default CategoryHelper;
