var express = require("express");
var router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");
const {
    validateCreateUser,
    validateLogin,
    validateRegister,
    validateUpdateUser,
    validateIdParam,
} = require("../middleware/validationMiddleware");

const userController = require("../controllers/userController");

//public routes
router.post("/login", validateLogin, userController.login);
router.post("/register", validateRegister, userController.createUserPublic);

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
    validateCreateUser,
    userController.createUser
);

router.patch(
    "/:id",
    validateIdParam,
    authMiddleware,
    checkPermission("edit_user"),
    validateUpdateUser,
    userController.updateUser
);

router.delete(
    "/:id",
    validateIdParam,
    authMiddleware,
    checkPermission("delete_user"),
    userController.deleteUser
);

module.exports = router;
