import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    photo: {
        type: String,
        required: [true, "Please enter Photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    name: {
        type: String,
        required: [true, "Please enter Name"],
    },
    email: {
        type: String,
        unique: [true, "Email Already Exits please try with different email"],
        required: [true, "Please enter Email"],
        validate: validator.default.isEmail,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of Birth"],
        validate: validator.default.isDate,
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    // Use function here
    const today = new Date();
    const dob = this.dob; // 'this' will now refer to the document instance
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
