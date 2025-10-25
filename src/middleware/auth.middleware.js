const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { handleAsync } = require("./error.middleware");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(new AppError("Access denied. No token provided.", 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new AppError("Invalid or expired token.", 403));
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
