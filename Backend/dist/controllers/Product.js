import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utily-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { fa, faker } from "@faker-js/faker";
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }
    if (category)
        baseQuery.category = category;
    const productPromise = Product.find(baseQuery)
        .sort(
    //   sort ? { price: sort ==="asc"?1:-1} : undefined
    sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
//Revalidate on New, Update  Delete Product & New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-products")) {
        products = JSON.parse(myCache.get("latest-products"));
    }
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        message: products,
    });
});
//Revalidate on New, Update  Delete Product & New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.json({
        success: true,
        categories,
    });
});
//Revalidate on New, Update  Delete Product & New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products"));
    else {
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product Not Found", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add Photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo?.path, () => {
            console.log("Deleted");
        });
        return next(new ErrorHandler("Missing some field", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: `Product Created SuccessFully`,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const id = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid Product Id", 404));
    if (photo) {
        rm(product?.photo, () => {
            console.log("old Photo Deleted");
        });
        product.photo = photo.path;
        return next(new ErrorHandler("Missing some field", 400));
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    await invalidateCache({ product: true, productId: String(product?._id) });
    return res.status(201).json({
        success: true,
        message: `Product Updated SuccessFully`,
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    rm(product?.photo, () => {
        console.log(`Product Photo Deleted`);
    });
    await product.deleteOne();
    await invalidateCache({ product: true, productId: String(product?._id) });
    return res.status(200).json({
        success: true,
        message: `Product Deleted Successfully`,
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: `${"../uploads/download.png"}`,
//       price: faker.commerce.price({ min: 1500, max: 800000 }),
//       stock: faker.commerce.price({ min: 0, max: 100 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       _v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ success: true });
// };
// generateRandomProducts(40);
// const deleteRandomProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(10);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ success: true });
// };
// deleteRandomProducts();
