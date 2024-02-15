const ApiError = require("../exceptions/apiError");
const UsersService = require("../services/users.service");
const TokenService = require("../services/tokens.service");

module.exports = async function (req, res, next) {
    try {
        if (req.user) {
            if (req.user.user) {
                if (req.user.user.blocked) {
                    return next(ApiError.BlockedError());
                }
            } else {
                if (req.user.blocked) {
                    return next(ApiError.BlockedError());
                }
            }
        }
        if (req.user && req.path === "/signin") {
            return res.json(req.user);
        }
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const userFromToken =
                TokenService.validateRefreshToken(refreshToken);
            const userData = await UsersService.getUser(userFromToken);
            if (userData) {
                if (userData.blocked) {
                    return next(ApiError.BlockedError());
                }
            }
        }
        next();
    } catch (err) {
        return next(ApiError.BlockedError());
    }
};
