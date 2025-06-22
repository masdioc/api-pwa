

// 📁 /routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const soalController = require("../controllers/soalController");
const authenticate = require("../middleware/authMiddleware");
const { importQuestions } = require('../controllers/importController');
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/updatePassword", authController.updatePassword);

router.get("/profile", authenticate, authController.profile);
router.get("/users", authController.getAllUsers); // 🔹 ini route baru
router.get("/soals", soalController.getAllSoals); // 🔹 ini route baru


router.post('/import', importQuestions);
module.exports = router;
