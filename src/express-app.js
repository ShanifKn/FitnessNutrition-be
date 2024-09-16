import express from "express";
import cors from "cors";
import { ErrorHandler, UserRouter } from "./api/index.js";

const ExpressApp = async (app) => {
  app.use(express.json());

  app.use(cors());

  UserRouter(app);

  app.use(ErrorHandler);
};

export default ExpressApp;
