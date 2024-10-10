import express from "express";
import cors from "cors";
import { BannerRouter, ErrorHandler, UserRouter } from "./api/index.js";

const ExpressApp = async (app) => {
  app.use(express.json());

  app.use(cors());

  UserRouter(app);

  BannerRouter(app); //

  app.use(ErrorHandler);
};

export default ExpressApp;
