import BannerHelper from "../api/helpers/banner.helper.js";

class BannerService {
  constructor() {
    this.bannerHelper = new BannerHelper();
  }

  async GetAllBanners() {
    const data = await this.bannerHelper.GetAllBanners();

    return await this.bannerHelper.SeparatedBanners(data);
  }

  async CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate }) {
    return await this.bannerHelper.CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate });
  }

  async DeleteBanner({ _id }) {
    return await this.bannerHelper.DeleteBanner({ _id });
  }
}

export default BannerService;
