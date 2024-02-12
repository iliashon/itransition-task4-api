const express = require("express"),
    router = express.Router(),
    UserController = require("../controllers/users.controller");

router.route("/:id").get(UserController.getUser);

router
    .route("/")
    .get(UserController.getAllUsers)
    .post(UserController.createUser)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser);

module.exports = router;
