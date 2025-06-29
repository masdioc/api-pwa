const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.get("/", userController.getUsersByRole);

router.get("/:id", userController.getUserById);
router.post("/update-profile/:id", userController.updateProfile);

module.exports = router;
