import express from "express";
import UserRoute from "./routes/user.js";
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
// connected to db
ConnectedDB(mongoURI);
const app = express();
app.use(express.json());
app.use(morgan("dev"));
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
