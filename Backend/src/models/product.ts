import mongoose from "mongoose";
import validator from "validator";
interface IUser extends Document {
  _id: string;
  name: string;
  photo: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  age: number;
}

const schema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please enter Name"],
      },
      photo: {
        type: String,
        required: [true, "Please enter Photo"],
      },
    price : {
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
      trim : true,
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IUser>("Product", schema);
