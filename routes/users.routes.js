const express = require("express"),
    router = express.Router(),
    UserController = require("../controllers/users.controller"),
    { body } = require("express-validator"),
    authMiddleware = require("../middlewares/authMiddleware"),
    blockedMiddleware = require("../middlewares/blockedMiddleware");

router
    .route("/signup")
    .post(
        body("email").isEmail(),
        body("password").isLength({ min: 1 }),
        UserController.createUser,
    );
router.route("/signin").post(blockedMiddleware, UserController.loginUser);
router.route("/logout").post(UserController.logoutUser);
router.route("/refresh").get(UserController.refresh);

router
    .route("/")
    .get(authMiddleware, blockedMiddleware, UserController.getAllUsers)
    .put(authMiddleware, UserController.updateUser)
    .delete(authMiddleware, UserController.deleteUser);

module.exports = router;
