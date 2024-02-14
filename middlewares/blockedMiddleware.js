const ApiError = require("../exceptions/apiError");
const UsersService = require("../services/users.service");

module.exports = async function (req, res, next) {
    try {
        if (req.user?.blocked) {
            return next(ApiError.BlockedError());
        }
        const user = await UsersService.getUser(req.body);
        if (user.blocked) {
            return next(ApiError.BlockedError());
        }
        next();
    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
};
