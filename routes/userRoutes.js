const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", userController.login);
router.post("/register", userController.createUser);

// Protected routes
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);
router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    userController.updateUser
);
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    userController.deleteUser
);

module.exports = router;
