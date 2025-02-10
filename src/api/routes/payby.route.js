import PaybyService from "../../services/payby.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import Validate from "../validations/validator.js";

const PayBy = (app) => {
  const service = new PaybyService();

  // @access  Private
  app.post(
    "/create-payby",
    Validate,
    tryCatch(async (req, res) => {
      const { orderId } = req.body;

      const currentDate = Date.now();


      const data = await service.CreateOrder({ orderId });

      return res.status(200).json({ data });
    })
  );
};

export default PayBy;
