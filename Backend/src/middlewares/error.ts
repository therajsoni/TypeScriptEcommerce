import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/utily-class.js";
import { ControllerType } from "../types/types.js";
export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode ||= 500;
  err.message ||= "Internal Server Error";
  if (err.name === "CastError") err.message = "Invalid id"; //
  if (err.statusCode === 11000)
    err.message = "Duplicate key says mongoose unique item dulpicate";
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
