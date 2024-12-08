import {
  Order,
  CartItem,
  Product,
  ShippingInfo,
  User,
  Stats,
  Pie,
  Bar,
  Line,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};
export type MessageResponse = {
  success: boolean;
  message: string;
};
export type UserResponse = {
  success: boolean;
  user: User;
};
export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};
export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};
export type SearchProductResponse = AllProductsResponse & {
  totalPage: number;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: string;
  order: Order;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type StatsResponse = {
  success: true;
  stats: Stats;
};

export type PieResponse = {
  success: true;
  charts: Pie;
};

export type BarResponse = {
  success: true;
  charts: Bar;
};

export type LineResponse = {
  success: true;
  charts: Line;
};

export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};
