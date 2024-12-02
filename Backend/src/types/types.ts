import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | void>;

export interface NewProductRequestBody {
  name: string;
  category: string;
  stock: number;
  price: number;
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export interface IOrderItem {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
}

export interface IShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

export interface IOrder extends Document {
  shippingInfo: IShippingInfo;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: IOrderItem[];
  createdAt: Date;
}

export interface NewOrderRequestBody {
  shippingInfo: IShippingInfo;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: IOrderItem[];
}
