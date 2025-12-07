const HTTP_STATUS = require("./src/utils/httpStatus");

// Wrapper for async controllers
const handleAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Middlware for error handling
const globalErrorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  // server error
  if (!err.isOperational) {
    console.log(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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
