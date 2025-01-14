import CustomerService from "../../services/customer.service.js";
import { tryCatch } from "../../utils/index.js";
import { LoginRateLimiter } from "../middlewares/apiLimiter.js";
import Authentication from "../middlewares/authentication.js";
import ExistCheck from "../validations/existCheck.js";
import { SchemaValidationForLogin } from "../validations/schema.validation.js";
import Validate from "../validations/validator.js";

const CustomerRoute = (app) => {
  const service = new CustomerService();

  app.get(
    "/customers",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetCustomer();

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/customer-details/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const data = await service.GetCustomerDetails({ _id });

      return res.status(200).json({ data });
    })
  );
};

export default CustomerRoute;
