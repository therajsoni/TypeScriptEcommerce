import express, { Request, Response, NextFunction } from "express";
import UserRoute from "./routes/user.js";
import ConnectedDB from "./utils/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import ProductRoute from "./routes/Products.js";

const app = express();
const port = 3000;

app.use(express.json());

// connected to db
ConnectedDB();

// Using Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/product",ProductRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(port);
});
