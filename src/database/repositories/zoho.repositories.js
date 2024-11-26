import { zohoToken } from "../models/zoho.model.js";

class ZohoRepository {
  async CreateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in }) {
    await zohoToken.create({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in });

    return { message: "New token generated" };
  }

  async UpdateZohoScret({ client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in }) {
    return await zohoToken.findOneAndReplace({ scope }, { client_id, client_secret, access_token, refresh_token, scope, api_domain, token_type, expires_in }, { upsert: true, new: true });
  }

  async GetTokens({ scope }) {
    return await zohoToken.findOne({ scope: scope });
  }
}

export default ZohoRepository;
