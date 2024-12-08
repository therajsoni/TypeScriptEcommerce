import express, { Request, Response, NextFunction } from "express";
import UserRoute from "./routes/user.js";
import Stripe from "stripe";
import ConnectedDB from "./utils/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import ProductRoute from "./routes/Products.js";
import NodeCache from "node-cache";
import orderRoute from "./routes/order.js";
import dotenv from "dotenv";
import morgan from "morgan";
import CouponRoute from "./routes/payment.js";
import dashBoardRoute from "./routes/stats.js";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const port = 3000;
const mongoURI = process.env.MONGO_URI as string;
const stripe_key = process.env.STRIPE_KEY;

// connected to db
ConnectedDB(mongoURI);

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
export const stripe = new Stripe(stripe_key!);
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
