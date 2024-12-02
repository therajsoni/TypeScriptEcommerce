import express from "express";
import {
  allCoupon,
  applyDiscount,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();
app.get("/discount", applyDiscount);
app.post("/coupon/new", adminOnly, newCoupon);
app.get("/coupon/all", adminOnly, allCoupon);
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
