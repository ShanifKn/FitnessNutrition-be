import CategoryHelper from "../api/helpers/category.helper.js";

class CategoryService {
  constructor() {
    this.categoryhelper = new CategoryHelper();
  }

  async CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory }) {
    return await this.categoryhelper.CreateCategory({ image, _id, title, tag, description, visibility, publishDate, maximumDiscount, featuredCategory, subCategory });
  }

  async CreateSubCategory({ _id, title, level, parent }) {
    return await this.categoryhelper.CreateSubCategory({ _id, title, level, parent });
  }

  async GetAllTheCategory() {
    return await this.categoryhelper.GetAllTheCategory();
  }

  async GetCategoryDetails({ _id }) {
    return await this.categoryhelper.GetCategoryDetails({ _id });
  }

  async GetNonFeaturedCategory() {
    return await this.categoryhelper.GetNonFeaturedCategory();
  }

  async GetAllFeaturedCategory() {
    return await this.categoryhelper.GetAllFeaturedCategory();
  }

  async DeleteCategory({ _id }) {
    return await this.categoryhelper.DeleteCategory({ _id });
  }
}

export default CategoryService;
