import UserRouter from "./routes/user.route.js";
import BannerRouter from "./routes/banner.route.js";
import CategoryRouter from "./routes/category.route.js";
import ErrorHandler from "./middlewares/errorHandler.js";
import ProductRouter from "./routes/prdocut.route.js";
import ZohoRouter from "./routes/zoho.route.js";
import CartRouter from "./routes/cart.route.js";
import CustomerRoute from "./routes/customer.route.js";
import OrdersRouter from "./routes/payment.route.js";
import PayBy from "./routes/payby.route.js";
import DriverRouter from "./routes/driver.route.js";

export { CustomerRoute, DriverRouter, PayBy, UserRouter, CartRouter, ErrorHandler, BannerRouter, CategoryRouter, ZohoRouter, ProductRouter, OrdersRouter };
