const AppError = require("../utils/AppError");
const HTTP_STATUS = require("../utils/httpStatus");

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. You do not have permission to perform this action.", HTTP_STATUS.UNAUTHORIZED)
      );
    }
    next();
  };
};

module.exports = authorize;
