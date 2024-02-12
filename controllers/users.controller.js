const UsersService = require('../services/users.service');

class UsersController {
    getUsers(req, res) {
        res.send('Get user')
    }

    async createUser(req, res) {
        const newPhone = await UsersService.createUser()
        res.send(JSON.stringify(newPhone))
    }

    async updateUser(req, res) {

    }

    async deleteUser(req, res) {

    }
}

module.exports = new UsersController();
