var express = require("express");
var router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

const userController = require("../controllers/userController");

//public routes
router.post("/login", userController.login);
router.post("/register", userController.createUserPublic);

//auth routes
router.get(
    "/",
    authMiddleware,
    checkPermission("get_user"),
    userController.getAllUsers
);

router.post(
    "/",
    authMiddleware,
    checkPermission("create_user"),
    userController.createUser
);

router.patch(
    "/:id",
    authMiddleware,
    checkPermission("edit_user"),
    userController.updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    checkPermission("delete_user"),
    userController.deleteUser
);

module.exports = router;
