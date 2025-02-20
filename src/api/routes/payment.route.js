import { PRIVATE_KEY_PATH, MERCHANT_ID } from "../../config/index.js";
import OrderService from "../../services/order.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import Validate from "../validations/validator.js";
import fs from "fs";
import crypto from "crypto";

const OrdersRouter = (app) => {
  const service = new OrderService();

  app.post(
    "/create-order",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const user = req.user._id;

      const { billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById } = req.body;

      const { message, pending } = await service.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total, payById });

      return res.status(200).json({ message, pending });
    })
  );

  app.get(
    "/orders-count",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const data = await service.GetOrdersCount();

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/get-orders",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { page = 1, limit = 10 } = req.query;

      const data = await service.GetOrders({ page, limit });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/get-returnOrders",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { page = 1, limit = 10 } = req.query;

      const data = await service.GetReturnOrders({ page, limit });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/order/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const data = await service.GetOrdersDetails({ _id });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/orderStatus/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const data = await service.GetOrdersStatus({ _id });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/order-update",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, orderComfirmed, invoiceId, product, remark } = req.body;

      const data = await service.UpdateOrder({ _id, orderComfirmed, invoiceId, product, remark });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/userOrders",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const user = req.user._id;

      const data = await service.GetUserOrder({ user });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/userOrders/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const _id = req.params;

      const data = await service.GetUserOrderDetails({ _id });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/order/assign",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { driverId, orderId } = req.body;

      const data = await service.AssignOrder({ driverId, orderId });

      return res.status(200).json({ data });
    })
  );
};

export default OrdersRouter;
