import mongoose, { Schema } from "mongoose";

const zohoSecret = new mongoose.Schema({
  access_token: { type: String, required: true },

  refresh_token: { type: String, required: true },

  scope: { type: String, required: true },

  api_domain: { type: String, required: true },

  token_type: { type: String, required: true },

  expires_in: { type: String, required: true },

  client_id: { type: String, required: true },

  client_secret: { type: String, required: true },
});

zohoSecret.index({ expires_in: 1 }, { expireAfterSeconds: 0 });

export const zohoToken = mongoose.model("ZohoSecret", zohoSecret);
