import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
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
        const ordersKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(ordersKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, ProductsCount, }) => {
    const categoriesCountPromise = categories?.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories?.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / ProductsCount) * 100),
        });
    });
    return categoryCount;
};
