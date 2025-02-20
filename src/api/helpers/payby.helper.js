import { MERCHANT_ID, PAYBY_API_KEY, PAYBY_API_URL } from "../../config/index.js";
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
          amount: formData.total || 0,
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

    console.log(datas)


    if (datas.head.applyStatus === "SUCCESS") {
      const data = { tokenUrl: datas.body.interActionParams.tokenUrl, payby: datas.body.acquireOrder.orderNo };

      return data;
    }
  }
}

export default PaybyHelper;
