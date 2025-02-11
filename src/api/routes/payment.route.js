import { PRIVATE_KEY_PATH, MERCHANT_ID } from "../../config/index.js";
import OrderService from "../../services/order.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import Validate from "../validations/validator.js";
import fs from "fs";
import crypto from "crypto";

const OrdersRouter = (app) => {
  const service = new OrderService();

  //@route POST/
  //@desc create a sub category
  //@access private
  app.post(
    "/create-payby",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const requestBody = {
        requestTime: Date.now(),
        bizContent: {
          merchantOrderNo: "M965739182419",
          subject: "Your subject",
          totalAmount: {
            currency: "AED",
            amount: 1.01,
          },
          paySceneCode: "PAYPAGE",
          accessoryContent: {
            amountDetail: {
              vatAmount: {
                currency: "AED",
                amount: 20.65,
              },
              amount: {
                currency: "AED",
                amount: 1.09,
              },
            },
            goodsDetail: {
              body: "Gifts",
              categoriesTree: "CT12",
              goodsCategory: "GC10",
              goodsId: "GI1005",
              goodsName: "candy flower",
              price: {
                currency: "AED",
                amount: 10.87,
              },
              quantity: 2,
            },
            terminalDetail: {
              operatorId: "OP1000000000000001",
              storeId: "SI100000000000002",
              terminalId: "TI100999999999900",
              merchantName: "candy home",
              storeName: "lovely house",
            },
          },
        },
      };

      const filePath = "./src/api/routes/Merchant_private_key.pem";
      const privateKey = fs.readFileSync(filePath, "utf8");

      // Convert requestBody to JSON string
      const requestBodyString = JSON.stringify(requestBody);

      // Create a Sign object
      const sign = crypto.createSign("SHA256");

      // Update the Sign object with the request body
      sign.update(requestBodyString);
      sign.end();

      // Generate the signature in base64 format
      const signature = sign.sign(privateKey, "base64");

      console.log("Generated Signature:", signature);

      const response = await fetch("https://uat.test2pay.com/sgs/api/acquire2/placeOrder", {
        method: "POST",
        headers: {
          "Content-Language": "en",
          "Content-Type": "application/json",
          sign: signature,
          "Partner-Id": MERCHANT_ID,
        },
        body: requestBodyString, // Use the JSON string as the body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Response:", data);

      return res.status(200).json({ iframeUrl: data.data.payPageUrl });
    })
  );

  app.post(
    "/create-order",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const user = req.user._id;

      const { billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total } = req.body;

      const { message, pending } = await service.createOrder({ user, billingInfo, product, paymentMethod, payment, shippingAddress, discountCoupon, discountAmount, orderComfirmed, total });

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
};

export default OrdersRouter;
