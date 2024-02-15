const UsersService = require("../services/users.service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/apiError");

const MAX_AGE_COOKIE = 30 * 24 * 60 * 60 * 1000;

class UsersController {
    async getAllUsers(req, res, next) {
        try {
            const data = await UsersService.getUsers();
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async createUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest("Validation error", errors.array()),
                );
            }
            const newUser = await UsersService.createUser(req.body);
            res.cookie("refreshToken", newUser.refreshToken, {
                maxAge: MAX_AGE_COOKIE,
                httpOnly: true,
            });
            res.json(newUser);
        } catch (err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const user = await UsersService.loginUser(req.body);
            res.cookie("refreshToken", user.refreshToken, {
                maxAge: MAX_AGE_COOKIE,
                httpOnly: true,
                sameSite: "none",
            });
            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    }

    async logoutUser(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UsersService.logoutUser(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const user = await UsersService.refresh(refreshToken);
            res.cookie("refreshToken", user.refreshToken, {
                maxAge: MAX_AGE_COOKIE,
                httpOnly: true,
            });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateUser(req, res) {
        if (
            !Array.isArray(req.body.id) ||
            !(typeof req.body.blocked === "boolean")
        ) {
            res.status(400).send({ message: "Invalid input data" });
        } else {
            const deleteUsers = await UsersService.updateUser(req.body);
            res.status(200).send(JSON.stringify(deleteUsers));
        }
    }

    async deleteUser(req, res) {
        if (!Array.isArray(req.body)) {
            res.status(400).send({ message: "Invalid input data" });
        } else {
            const deleteUsers = await UsersService.deleteUser(req.body);
            res.json(deleteUsers);
        }
    }
}

module.exports = new UsersController();
