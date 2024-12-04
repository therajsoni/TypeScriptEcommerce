import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats;
    let key = "admin-stats";
    if (myCache.has(key))
        stats = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0), // 0 means 31 or 30 date
        };
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthUserPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthUserPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const latestTransactionsPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthUser, thisMonthProducts, thisMonthOrders, lastMonthOrders, lastMonthUser, lastMonthProducts, ProductsCount, UsersCount, allOrders, lastSixMonthOrders, categories, femaleUserCount, latestTransaction,] = await Promise.all([
            thisMonthUserPromise,
            thisMonthProductsPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,
            lastMonthUserPromise,
            lastMonthProductsPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionsPromise,
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + order.total, 0);
        const changePercent = {
            revenue: {
                thisMonthRevenue,
                lastMonthRevenue,
            },
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = allOrders.reduce((total, order) => total + order.total, 0);
        const count = {
            revenue,
            user: UsersCount,
            product: ProductsCount,
            order: allOrders.length,
        };
        const orderMonthyCounts = new Array(6).fill(0);
        const orderMonthyRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if (monthDiff < 6) {
                orderMonthyCounts[6 - monthDiff - 1] += 1;
                orderMonthyRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await getInventories({
            categories,
            ProductsCount,
        });
        const userRatio = {
            male: UsersCount - femaleUserCount,
            female: femaleUserCount,
        };
        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i?._id,
            discount: i?.discount,
            amount: i?.total,
            quantity: i?.orderItems?.length,
            status: i.status,
        }));
        stats = {
            categoryCount,
            changePercent,
            count,
            charts: {
                order: orderMonthyCounts,
                revenue: orderMonthyRevenue,
            },
            userRatio,
            latestTransaction: modifiedLatestTransaction,
        };
        myCache.set(key, JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts = undefined;
    let key = "admin-pie-charts";
    if (myCache.has("admin-pie-charts"))
        charts = JSON.parse(myCache.get(key));
    else {
        const allOrderPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shipping",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, ProductsCount, OutOfStock, allOrders, allUsers, adminUsers, customUsers,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await getInventories({
            categories,
            ProductsCount,
        });
        const stockAvailablity = {
            inStock: ProductsCount - OutOfStock,
            OutOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customUsers,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async () => { });
export const getBarCharts = TryCatch(async () => { });
