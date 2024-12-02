import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, IOrderItem } from "../types/types.js";

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId?.forEach((i) => productKeys.push(`product-${i}`));
    }
    // product-${id}
    // const products = await Product.find({}).select("_id");
    // products.forEach((item) => {
    //   const id = item?._id;
    //   productKeys.push(`product-${id}`);
    // });
    myCache.del(productKeys);
  }
  if (order) {
    // my-orders-${id}
    // all-orders
    // order-${id}
    const ordersKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(ordersKeys);
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: IOrderItem[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(percent.toFixed(0));
};
