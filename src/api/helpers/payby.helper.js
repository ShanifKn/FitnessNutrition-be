import { MERCHANT_ID, PAYBY_API_KEY, PAYBY_API_URL } from "../../config/index.js";
import fs from "fs";
import crypto from "crypto";
import path from "path";

class PaybyHelper {
  constructor() {}

  async CreateOrder({ orderId }) {
    const headers = {
      "Content-Language": "en",
      "Content-Type": "application/json",
      sign: PAYBY_API_KEY, // Replace with the actual signature
      "Partner-Id": "200000081741",
    };

    const body = JSON.stringify({
      requestTime: Date.now(), // Dynamic timestamp
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
    });

    const response = await fetch(PAYBY_API_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
  }

  signData(data) {
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(data);
    return signer.sign(privateKey, "base64");
  }
}

export default PaybyHelper;
