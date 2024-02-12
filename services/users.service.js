const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class UsersService {
    getUsers() {}

    createUser(data) {
        return prisma.phones.create({
            data: {
                name: "Apple",
                model: "Iphone 14 pro",
            },
        });
    }

    updateUser(data) {}

    deleteUser(data) {}
}

module.exports = new UsersService();
