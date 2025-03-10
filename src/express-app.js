import express from "express";
import cors from "cors";
import { BannerRouter, CartRouter, CategoryRouter, CustomerRoute, DriverRouter, ErrorHandler, OrdersRouter, PayBy, ProductRouter, UserRouter, ZohoRouter } from "./api/index.js";
import path from "path";
import { fileURLToPath } from "url";

const ExpressApp = async (app) => {
  // Using Express built-in middleware
  app.use(express.json({ limit: "10mb" })); // Increase JSON body limit

  app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded limit

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.use(cors());

  UserRouter(app);

  BannerRouter(app); //

  CategoryRouter(app); //

  ZohoRouter(app); //

  ProductRouter(app); //

  CartRouter(app);

  CustomerRoute(app);

  OrdersRouter(app);

  PayBy(app);

  DriverRouter(app);

  app.use(ErrorHandler);
};

export default ExpressApp;
