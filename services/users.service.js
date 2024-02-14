const { PrismaClient } = require("@prisma/client");
const TokenService = require("./tokens.service");
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/apiError");

const prisma = new PrismaClient();

const HASH_SALT = 3;
const SELECT_USERS = {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    blocked: true,
    last_login: true,
    created_at: true,
    updated_at: true,
};
const FIELDS_TO_CREATE_USER = ["email", "password", "first_name", "last_name"];

class UsersService {
    async createUser(data) {
        const candidate = await prisma.users.findFirst({
            where: { email: data.email },
        });
        if (candidate) {
            throw ApiError.BadRequest(
                `User with email address ${data.email} already exists`,
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, HASH_SALT);

        const user = await prisma.users.create({
            data: {
                email: data.email,
                password: hashedPassword,
                first_name: data.first_name,
                last_name: data.last_name,
            },
            select: SELECT_USERS,
        });
        const tokens = TokenService.generateToken(user);
        await TokenService.saveToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: user,
        };
    }

    async loginUser(data) {
        const user = await prisma.users.findFirst({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw ApiError.BadRequest("There is no user with this email");
        }
        const isPassEqual = await bcrypt.compare(data.password, user.password);
        if (!isPassEqual) {
            throw ApiError.BadRequest("Incorrect password");
        }
        const tokens = TokenService.generateToken(user);
        await TokenService.saveToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: user,
        };
    }

    async logoutUser(refreshToken) {
        return TokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await prisma.users.findFirst({
            where: {
                id: userData.id,
            },
        });
        const tokens = TokenService.generateToken(user, HASH_SALT);
        await TokenService.saveToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: user,
        };
    }

    getUser(data) {
        return prisma.users.findFirst({
            where: {
                email: data.email,
            },
        });
    }

    getUsers() {
        return prisma.users.findMany({
            select: SELECT_USERS,
        });
    }

    updateUser(data) {
        return prisma.users.updateMany({
            where: {
                id: { in: data.id },
            },
            data: {
                blocked: data.blocked,
            },
        });
    }

    deleteUser(data) {
        return prisma.users.deleteMany({
            where: {
                id: { in: data.id },
            },
        });
    }
}

module.exports = new UsersService();
