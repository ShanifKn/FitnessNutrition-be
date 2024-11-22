import BannerRepository from "../../database/repositories/banner.repositories.js";
import { ObjectId } from "mongodb";

class BannerHelper {
  constructor() {
    this.repositories = new BannerRepository();
  }

  async GetAllBanners() {
    return await this.repositories.GetAllBanners();
  }

  async CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate }) {
    if (!_id) {
      _id = new ObjectId();
    }

    await this.repositories.CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate });

    return { message: "New Banner has been Added" };
  }

  async DeleteBanner({ _id }) {
    await this.repositories.DeleteBanner({ _id });

    return { message: "Banner deleted successfully" };
  }

  async SeparatedBanners(data) {
    const banners = {
      mainBanners: [],
      subBanners: [],
      offerBanners: [],
      bottomBanners: [],
    };

    // Separate banners into respective arrays based on their type
    data.forEach((data) => {
      switch (data.bannerType) {
        case "Main Banner":
          banners.mainBanners.push(data);
          break;
        case "Sub Banner":
          banners.subBanners.push(data);
          break;
        case "Offer Banner":
          banners.offerBanners.push(data);
          break;
        case "Bottom Banner":
          banners.bottomBanners.push(data);
          break;
        default:
          break; // Optional: handle unexpected types if needed
      }
    });

    return banners;
  }


  async GetUserBanners() {
    return await this.repositories.GetUserBanners();
  }

}

export default BannerHelper;
