import BannerService from "../../services/banner.service.js";
import { tryCatch } from "../../utils/index.js";
import { Authentication } from "../validations/authentication.js";
import { SchemaValidationForBanner } from "../validations/schema.validation.js";
import Validate from "../validations/validator.js";

const BannerRouter = (app) => {
  const service = new BannerService();

  ///---------api -----------//

  //@route Get /banners
  //@des  For getting the all banner
  //@access Public
  app.get(
    "/banners",
    tryCatch(async (req, res) => {
      const data = await service.GetAllBanners();

      return res.status(200).json({ data });
    })
  );

  //@route POST /create-banner
  //@des  For create new banner and update banner
  //@access Private
  app.post(
    "/create-banner",
    SchemaValidationForBanner,
    // Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, title, bannerType, visibility, category, subCategory, product, image, expDate } = req.body;

      const { message } = await service.CreateBanner({ _id, title, bannerType, visibility, category, subCategory, product, image, expDate });

      return res.status(200).json({ message });
    })
  );

  //@route Delete /banner/:_id
  //@des  Delete a banner
  //@access Private
  app.delete(
    "/banner/:_id",
    // Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const { message } = await service.DeleteBanner({ _id });

      return res.status(200).json({ message });
    })
  );
};

export default BannerRouter;
