import express from "express";
import UserRoute from "./routes/user.js";
import Stripe from "stripe";
import ConnectedDB from "./utils/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import ProductRoute from "./routes/Products.js";
import NodeCache from "node-cache";
import orderRoute from "./routes/order.js";
import morgan from "morgan";
import CouponRoute from "./routes/payment.js";
import dashBoardRoute from "./routes/stats.js";
// dotenv.config({
//   path: "./.env",
// });
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const stripe_key = process.env.STRIPE_KEY ||
    "sk_test_51Q6WJKP24Z3LRKVeJz8PabQKEdWkxYcfHfIIu3S5B3W8x7dU7YfHkQ3IAqWVoT1vtDicWlIBmT2pQ34uLkKu4ns400n60WFDpr";
// connected to db
ConnectedDB(mongoURI);
const app = express();
app.use(express.json());
app.use(morgan("dev"));
export const stripe = new Stripe(stripe_key);
export const myCache = new NodeCache();
// Using Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", CouponRoute);
app.use("/api/v1/dashboard", dashBoardRoute);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(port);
});
