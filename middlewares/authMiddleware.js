const ApiError = require("../exceptions/apiError");
const TokenService = require("../services/tokens.service");
const UsersService = require("../services/users.service");

module.exports = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        const userDb = await UsersService.getUser(userData);
        if (!userDb) {
            return next(ApiError.UnauthorizedError());
        }
        req.user = userDb;
        next();
    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
};
