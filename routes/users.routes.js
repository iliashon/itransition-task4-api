const express = require("express"),
    router = express.Router(),
    UserController = require("../controllers/users.controller");

router
    .route("/")
    .get(UserController.getUsers)
    .post(UserController.createUser)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser);

module.exports = router;
