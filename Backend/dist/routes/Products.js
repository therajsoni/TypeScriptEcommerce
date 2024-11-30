import express from "express";
import { newProduct } from "../controllers/product.js";
const app = express.Router();
app.post("/new", newProduct);
export default app;
