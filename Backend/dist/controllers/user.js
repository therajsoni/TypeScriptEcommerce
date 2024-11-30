import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utily-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, dob, _id } = req.body;
    let user = await User.findById(_id);
    if (user)
        return res.status(200).json({
            success: true,
            message: `Welcome back`,
        });
    if (!name || !email || !photo || !gender || !dob || !_id) {
        return next(new ErrorHandler("Please add all Fields", 400));
    }
    user = await User.create({
        name,
        email,
        photo,
        gender,
        dob: new Date(dob),
        _id,
    });
    return res.status(201).json({
        success: true,
        message: `created ${user.name} and his id is ${user._id}`,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(201).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(201).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let user = User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id,400"));
    user = await User.deleteOne({ _id: id });
    return res.status(201).json({
        success: true,
        message: `${id} is id and  is deleted`,
    });
});
