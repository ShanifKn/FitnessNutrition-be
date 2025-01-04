import ZohoService from "../../services/zoho.service.js";
import { tryCatch } from "../../utils/index.js";
import Validate from "../validations/validator.js";

const ZohoRouter = (app) => {
  const service = new ZohoService();

  // @route   POST /
  // @des     access and generate token
  // @access  Public
  app.post(
    "/create-token",
    Validate,
    tryCatch(async (req, res) => {
      const { client_id, client_secret, code } = req.body;

      const { message } = await service.GenerateToken(client_id, client_secret, code);

      return res.status(200).json({ message });
    })
  );

  app.post(
    "/create-cart",
    // Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { user, items } = req.body;

      const data = await service.CreateCart({ user, items });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/get-ZohoProducts",
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetProducts();

      return res.status(200).json({ data });
    })
  );
};

export default ZohoRouter;
