var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.getAllUsers);

router.post("/", userController.createUser);

router.patch("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);



module.exports = router;
