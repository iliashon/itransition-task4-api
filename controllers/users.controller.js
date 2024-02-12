const UsersService = require("../services/users.service");
const arrayComprasion = require("../utils/arrayComprasion");

const FIELDS_TO_CREATE_USER = ["email", "password", "first_name", "last_name"];

class UsersController {
    async getUser(req, res) {
        res.send(JSON.stringify({ id: req.params.id }));
    }
    async getAllUsers(req, res) {
        const data = await UsersService.getUsers();
        res.send(JSON.stringify(data));
    }

    async createUser(req, res) {
        if (!arrayComprasion(Object.keys(req.body), FIELDS_TO_CREATE_USER)) {
            res.status(400).send({ message: "Invalid input data" });
        } else {
            const newUser = await UsersService.createUser(req.body);
            res.status(200).send(JSON.stringify(newUser));
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
        if (!Array.isArray(req.body.id)) {
            res.status(400).send({ message: "Invalid input data" });
        } else {
            const deleteUsers = await UsersService.deleteUser(req.body);
            res.status(200).send(JSON.stringify(deleteUsers));
        }
    }
}

module.exports = new UsersController();
