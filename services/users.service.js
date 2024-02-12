const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class UsersService {
    getUsers() {
        return prisma.users.findMany({
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                blocked: true,
                last_login: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    createUser(data) {
        return prisma.users.create({
            data: {
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name,
            },
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
