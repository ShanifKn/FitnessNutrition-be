import { BannerModel } from "../models/banner.model.js";

class BannerRepository {
  constructor() {}

  async GetAllBanners() {
    return await BannerModel.find();
  }

  async CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate }) {
    return await BannerModel.findOneAndUpdate({ _id }, { title, bannerType, visibility, category, subCategory, product, image, expDate }, { upsert: true });
  }

  async DeleteBanner({ _id }) {
    return await BannerModel.findByIdAndDelete({ _id });
  }

  async GetUserBanners() {
    return await BannerModel.find({ visibility: true });
  }
}

export default BannerRepository;
