import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utily-class.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) return next(new ErrorHandler("Please Enter Amount", 404));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new ErrorHandler("Enter All fields", 404));
  await Coupon.create({
    code: coupon,
    amount,
  });
  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created SuccessFully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  if (!coupon) return next(new ErrorHandler("Enter All fields", 404));

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) return next(new ErrorHandler("InValid Coupon Code", 400));

  return res.status(201).json({
    success: true,
    discount: discount.amount,
  });
});

export const allCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});
  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler("Coupon Not Found", 400));
  await coupon.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Coupon deleted SuccessFully",
  });
});
