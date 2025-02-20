import ZohoRepository from "../../database/repositories/zoho.repositories.js";
import fetch from "node-fetch";
import { AppError, tryCatch } from "../../utils/index.js";
import { ZOHO_API_ERROR } from "../constants/errorCodes.js";
import { PAGE_LENGTH, ZOHO_GENERATE_TOKEN, ZOHO_ORGANIZATION, ZOHO_PRODUCT_URL } from "../../config/index.js";
import { Product } from "../../database/models/product.model.js";
import ProductRepository from "../../database/repositories/product.repositories.js";
import { ObjectId } from "mongodb";

class ZohoHelper {
  constructor() {
    this.repository = new ZohoRepository();
    this.productRespository = new ProductRepository();
  }

  async GenerateCode(client_id, client_secret, code) {
    const redirect_uri = "http://www.zoho.com/books";

    // Construct the full URL with query parameters
    const url = `${ZOHO_GENERATE_TOKEN}?code=${encodeURIComponent(code)}&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&redirect_uri=${encodeURIComponent(redirect_uri)}&grant_type=authorization_code`;

    try {
      const response = await fetch(url, {
        method: "POST", // POST method
      });

      if (!response.ok) {
        throw new AppError(ZOHO_API_ERROR, "Zoho API Error", response.status);
      }

      const data = await response.json();

      if (data.error === "invalid_code") {
        throw new AppError(ZOHO_API_ERROR, "Invalid generate code", 400);
      }

      return data;
    } catch (error) {
      // console.error("Error:", error);
      throw new AppError(ZOHO_API_ERROR, error.message, 400);
    }
  }

  async ReGenerateCode({ client_id, client_secret, refresh_token }) {
    const redirect_uri = "http://www.zoho.com/books";

    const url = `${ZOHO_GENERATE_TOKEN}?refresh_token=${encodeURIComponent(refresh_token)}&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&redirect_uri=${encodeURIComponent(redirect_uri)}&grant_type=refresh_token`;

    try {
      const response = await fetch(url, {
        method: "POST", // POST method
      });

      if (!response.ok) {
        throw new AppError(ZOHO_API_ERROR, "Zoho API Error", response.status);
      }

      const data = await response.json();

      const { access_token, scope, api_domain, token_type, expires_in } = data;

      await this.repository.UpdateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in });

      return data;
    } catch (error) {
      // console.error("Error:", error);
      throw new AppError(ZOHO_API_ERROR, error.message, 400);
    }
  }

  async CreateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in }) {
    return await this.repository.CreateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in });
  }

  async GetToken() {
    return await this.repository.GetTokens();
  }

  async GetZohoApi(baseUrl, access_token, organizationID) {
    const pageList = Array.from({ length: PAGE_LENGTH }, (_, index) => index + 1);

    const perPage = 200;

    const allProducts = [];

    try {
      const requests = pageList.map((page) => {
        const url = `${baseUrl}?page=${page}&per_page=${perPage}&organization_id=${organizationID}`;

        return fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }).then((response) => {
          if (!response.ok) {
            throw new AppError(ZOHO_API_ERROR, `Zoho API Error: Page ${page}`, response.status);
          }
          return response.json();
        });
      });

      const responses = await Promise.all(requests);

      responses.forEach((data, index) => {
        if (data && data.items) {
          allProducts.push(...data.items);
        } else {
          console.warn(`No products found on page ${pageList[index]}`);
        }
      });

      return allProducts;
    } catch (error) {
      throw new AppError(ZOHO_API_ERROR, error.message, 400);
    }
  }

  async SaveProduct(items) {
    const updatePromises = items.map(async (item, index) => {
      const {
        item_id,
        name,
        item_name,
        unit,
        status,
        source,
        is_linked_with_zohocrm,
        zcrm_product_id,
        description,
        rate,
        tax_id,
        tax_name,
        tax_percentage,
        purchase_account_id,
        purchase_account_name,
        account_id,
        account_name,
        purchase_description,
        purchase_rate,
        item_type,
        product_type,
        is_taxable,
        tax_exemption_id,
        tax_exemption_code,
        stock_on_hand,
        has_attachment,
        available_stock,
        actual_available_stock,
        sku,
        reorder_level,
        created_time,
        last_modified_time,
        cf_movemet_measure,
        cf_movemet_measure_unformatted,
        cf_storage_condition,
        cf_storage_condition_unformatted,
        cf_classification,
        cf_classification_unformatted,
        cf_component_type,
        cf_component_type_unformatted,
        cf_usage_unit,
        cf_usage_unit_unformatted,
        category,
        subCategory,
        image,
        additionalDescription,
        available_size,
        available_flavor,
      } = item;

      const _id = new ObjectId();

      // Return the promise of updating the product
      return await this.productRespository.UpdataProduct({
        _id,
        item_id,
        name,
        item_name,
        unit,
        status,
        source,
        is_linked_with_zohocrm,
        zcrm_product_id,
        description,
        rate,
        tax_id,
        tax_name,
        tax_percentage,
        purchase_account_id,
        purchase_account_name,
        account_id,
        account_name,
        purchase_description,
        purchase_rate,
        item_type,
        product_type,
        is_taxable,
        tax_exemption_id,
        tax_exemption_code,
        stock_on_hand,
        has_attachment,
        available_stock,
        actual_available_stock,
        sku,
        reorder_level,
        created_time,
        last_modified_time,
        cf_movemet_measure,
        cf_movemet_measure_unformatted,
        cf_storage_condition,
        cf_storage_condition_unformatted,
        cf_classification,
        cf_classification_unformatted,
        cf_component_type,
        cf_component_type_unformatted,
        cf_usage_unit,
        cf_usage_unit_unformatted,
        category,
        subCategory,
        image,
        additionalDescription,
        available_size,
        available_flavor,
      });
    });

    await Promise.all(updatePromises);

    return "All products processed successfully.";
  }

  async CreateCustomer({ email, name, phone, access_token }) {
    const url = `https://www.zohoapis.com/books/v3/contacts?organization_id=${ZOHO_ORGANIZATION}`;

    const payload = {
      contact_name: email,
      company_name: name, // Assuming the company name is the same as the contact name
      contact_persons: [
        {
          email: email,
          phone: phone,
          first_name: name,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`, // Use your actual Zoho auth token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new AppError(ZOHO_API_ERROR, "User already registered. Please log in.", 400);
      }

      const data = await response.json();

      return data;
    } catch (e) {
      throw new AppError(ZOHO_API_ERROR, "User already registered. Please log in.", 400);
    }
  }

  async CreateSalesOrder({ zohoPayload, access_token }) {
    const url = `https://www.zohoapis.com/books/v3/salesorders?organization_id=${ZOHO_ORGANIZATION}`;

    console.log(zohoPayload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`, // Use your actual Zoho auth token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zohoPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AppError(ZOHO_API_ERROR, "Please try again after sometimes.", 400);
      }

      return data;
    } catch (e) {
      throw new AppError(ZOHO_API_ERROR, "Please try again after sometimes.", 400);
    }
  }
}

export default ZohoHelper;
