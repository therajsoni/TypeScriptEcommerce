import mongoose from "mongoose";
interface IProduct extends Document {
  name: string;
  stock: number;
  photo: string;
  category: string;
  price: number;
  createdAt: Date;
}

const schema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Product category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", schema);
