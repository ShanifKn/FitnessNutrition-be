import { ZOHO_API_ERROR } from "../api/constants/errorCodes.js";
import ZohoHelper from "../api/helpers/zoho.helper.js";
import { ZOHO_ORGANIZATION, ZOHO_PRODUCT_URL } from "../config/index.js";
import AppError from "../utils/appError.js";

class ZohoService {
  constructor() {
    this.helper = new ZohoHelper();
  }

  async GenerateToken(client_id, client_secret, code) {
    const { access_token, refresh_token, scope, api_domain, token_type, expires_in } = await this.helper.GenerateCode(client_id, client_secret, code);

    return await this.helper.CreateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in });
  }

  async GetProducts() {
    const token = await this.helper.GetToken();

    if (!token) throw new AppError(ZOHO_API_ERROR, "Generate Zoho access token", 400);

    const { client_id, client_secret, refresh_token } = token;

    const { access_token } = await this.helper.ReGenerateCode({ client_id, client_secret, refresh_token });

    const productUrl = ZOHO_PRODUCT_URL;

    const organizationID = ZOHO_ORGANIZATION;

    const data = await this.helper.GetZohoApi(productUrl, access_token, organizationID);


    if (data) return await this.helper.SaveProduct(data);

    return data;
  }

  async CreateCustomer({ email, name, phone }) {
    const token = await this.helper.GetToken();

    if (!token) throw new AppError(ZOHO_API_ERROR, "Generate Zoho access token", 400);

    const { client_id, client_secret, refresh_token } = token;

    const { access_token } = await this.helper.ReGenerateCode({ client_id, client_secret, refresh_token });

    return await this.helper.CreateCustomer({ email, name, phone, access_token });
  }

  async CreateSalesOrder({ zohoPayload }) {
    const token = await this.helper.GetToken();

    if (!token) throw new AppError(ZOHO_API_ERROR, "Generate Zoho access token", 400);

    const { client_id, client_secret, refresh_token } = token;

    const { access_token } = await this.helper.ReGenerateCode({ client_id, client_secret, refresh_token });

    const salesOrder = await this.helper.CreateSalesOrder({ zohoPayload, access_token });

    return { created: true, salesOrder: salesOrder.salesorder };
  }
}

export default ZohoService;
