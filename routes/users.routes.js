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
router.route("/signin").post(UserController.loginUser, blockedMiddleware);
router.route("/logout").post(UserController.logoutUser);
router.route("/refresh").get(blockedMiddleware, UserController.refresh);

router
    .route("/")
    .get(authMiddleware, blockedMiddleware, UserController.getAllUsers)
    .put(authMiddleware, blockedMiddleware, UserController.updateUser)
    .delete(authMiddleware, blockedMiddleware, UserController.deleteUser);

module.exports = router;
