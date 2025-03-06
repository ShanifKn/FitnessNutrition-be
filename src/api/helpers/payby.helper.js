import { MERCHANT_ID, PAYBY_API_KEY, PAYBY_API_URL, PAYBY_REFUND_URL } from "../../config/index.js";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { AppError, tryCatch } from "../../utils/index.js";
import { ZOHO_API_ERROR } from "../constants/errorCodes.js";

class PaybyHelper {
  constructor() {}

  async CreateOrder({ formData }) {
    const requestBody = {
      requestTime: Date.now(),
      bizContent: {
        merchantOrderNo: `M${Math.floor(Math.random() * 1000000000000)}`,
        subject: formData.product[0]?.name,
        totalAmount: {
          currency: "AED",
          amount: String(Number(formData.total).toFixed(2)),
        },
        paySceneCode: "PAYPAGE",
      },
    };

    const filePath = "./Merchant_private_key.pem";

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

    const response = await fetch(PAYBY_API_URL, {
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
      throw new AppError(ZOHO_API_ERROR, "Invalid generate code", 400);
    }

    const datas = await response.json();

    if (datas.head.applyStatus === "SUCCESS") {
      const data = { tokenUrl: datas.body.interActionParams.tokenUrl, payby: datas.body.acquireOrder.orderNo };

      return data;
    }
  }

  async RefundOrder({ order }) {
    const refundMerchantOrderNo = `REFUND_${order.id}_${Date.now()}`; // Generate a unique refund ID

    const requestBody = {
      requestTime: Date.now(),
      bizContent: {
        refundMerchantOrderNo: refundMerchantOrderNo, // Use the generated refund ID
        originOrderNo: order.payById, // PayBy's original transaction ID
        amount: {
          currency: "AED",
          amount: String(Number(order.total).toFixed(2)),
        },
        reason: order.refundReason || "No reason provided", // Optional: Reason for refund
        // Optional: Your endpoint to receive refund notifications
      },
    };

    const filePath = "./Merchant_private_key.pem";
    const privateKey = fs.readFileSync(filePath, "utf8");

    const requestBodyString = JSON.stringify(requestBody);
    const sign = crypto.createSign("SHA256");
    sign.update(requestBodyString);
    sign.end();
    const signature = sign.sign(privateKey, "base64");

    const response = await fetch(PAYBY_REFUND_URL, {
      method: "POST",
      headers: {
        "Content-Language": "en",
        "Content-Type": "application/json",
        sign: signature,
        "Partner-Id": MERCHANT_ID,
      },
      body: requestBodyString,
    });

    const responseData = await response.json();

    // Handle the response based on PayBy's API documentation
    if (responseData.head.msg === "SUCCESS") {

      return refundMerchantOrderNo;
    } else {
      // console.error(`Refund failed: ${responseData.msg} (Code: ${responseData.code})`);
      throw new AppError(ZOHO_API_ERROR, "Please try again later", 400);
    }
  }
}

export default PaybyHelper;
