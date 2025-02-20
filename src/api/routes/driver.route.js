import DriverService from "../../services/driver.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import ExistCheck from "../validations/driver.validator.js";
import Validate from "../validations/validator.js";

const DriverRouter = (app) => {
  const service = new DriverService();
  const check = new ExistCheck();

  app.post(
    "/create-driver",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { image, name, email, phone, whatappPhone, branch, location, dlNo } = req.body;

      await check.ForSignup({ email });

      const data = await service.createDriver({ image, name, email, phone, whatappPhone, branch, location, dlNo });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.get(
    "/drivers",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { page = 1, limit = 10 } = req.query;

      const data = await service.getDriverWithLimit({ page, limit });

      return res.status(200).json({ data });
    })
  );

  // @route GET /
  // @des get product for shop page
  // @access public
  app.get(
    "/driver/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const data = await service.getDriverDetails({ _id });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/update-driver",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active } = req.body;

      const data = await service.updateDriver({ _id, image, name, email, phone, whatappPhone, branch, location, dlNo, active });

      return res.status(200).json({ message: "Driver updated successfully", data });
    })
  );

  app.get(
    "/driver/order/count",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const driverId = req.body;

      const data = await service.getDriverOrderCount({ driverId });

      return res.status(200).json({ data });
    })
  );




  
  app.post(
    "/driver/login",
    Validate,
    tryCatch(async (req, res) => {
      const { email, password } = req.body;

      await check.ForLogin({ email });

      const data = await service.driverLogin({ email, password });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/driver/resetPassword",
    Validate,
    tryCatch(async (req, res) => {
      const { email } = req.body;

      await check.ForLogin({ email });

      const data = await service.resetPassword({ email });

      return res.status(200).json({ data });
    })
  );
};

export default DriverRouter;
