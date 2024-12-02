import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  let key = "admin-stats";
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
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

    const [
      thisMonthUser,
      thisMonthProducts,
      thisMonthOrders,
      lastMonthOrders,
      lastMonthUser,
      lastMonthProducts,
      ProductsCount,
      UsersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUserCount,
      latestTransaction,
    ] = await Promise.all([
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
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + order.total,
      0
    );
    const changePercent = {
      revenue: {
        thisMonthRevenue,
        lastMonthRevenue,
      },
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
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

    const categoriesCountPromise = categories?.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount: Record<string, number>[] = [];
    categories?.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / ProductsCount) * 100),
      });
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
export const getPieCharts = TryCatch(async () => {});
export const getLineCharts = TryCatch(async () => {});
export const getBarCharts = TryCatch(async () => {});
