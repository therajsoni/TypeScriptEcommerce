export const errorMiddleware = (err, req, res, next) => {
    err.statusCode || (err.statusCode = 500);
    err.message || (err.message = "Internal Server Error");
    if (err.name === "CastError")
        err.message = "Invalid id"; //
    if (err.statusCode === 11000)
        err.message = "Duplicate key says mongoose unique item dulpicate";
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
