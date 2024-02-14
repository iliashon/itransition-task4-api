const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30s",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return null;
        }
    }

    async findToken(refreshToken) {
        return prisma.tokens.findFirst({
            where: {
                refresh_token: refreshToken,
            },
        });
    }

    async saveToken(userId, refreshToken) {
        const token = await prisma.tokens.findFirst({
            where: {
                user_id: userId,
            },
        });
        if (token) {
            return prisma.tokens.update({
                where: {
                    user_id: userId,
                },
                data: {
                    refresh_token: refreshToken,
                },
            });
        }
        return prisma.tokens.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
            },
        });
    }

    async removeToken(refreshToken) {
        return prisma.tokens.deleteMany({
            where: {
                refresh_token: refreshToken,
            },
        });
    }
}

module.exports = new TokenService();
