

// 📁 /routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticate, authController.profile);
router.get("/users", authController.getAllUsers); // 🔹 ini route baru
module.exports = router;
