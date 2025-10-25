const AppError = require("../utils/AppError");

// Wrapper for async controllers
const handleAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Middlware for error handling
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // server error
    if (!err.isOperational) {
        console.error("ERROR:", err);
        
        return res.status(500).json({
        status: "error",
        message: "Server side error.",
        });
    }

    // operational error
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = { globalErrorHandler, handleAsync };
