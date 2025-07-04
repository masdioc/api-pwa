// 📁 /routes/auth.js
const express = require("express");
const app = express();
const cors = require("cors");
const upload = require("../middleware/uploadMiddleware");
// const apiRoutes = require("./routes/authRoutes"); // atau nama file route kamu

app.use(cors());
app.use(express.json()); // penting untuk parse JSON body

const router = express.Router();
const authController = require("../controllers/authController");
const soalController = require("../controllers/soalController");
const surahController = require("../controllers/surahController");
const observasiController = require("../controllers/observasiController");
const authenticate = require("../middleware/authMiddleware");
const { importQuestions } = require("../controllers/importController");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/update-password", authController.updatePassword);
router.post("/hafalan", authController.hafalan);
router.post("/last-read", surahController.saveLastRead);
router.get("/last-read", surahController.getLastRead);
router.get("/last-read/all", surahController.getAllLastRead);
router.post("/last-read/update-status", surahController.updateLastReadStatus);

router.post(
  "/update-photo",
  upload.single("photo"),
  authController.updatePhoto
);

router.post("/add-observasi", observasiController.generateObservasi);
router.post("/update-observasi", observasiController.updateObservasi);

router.post("/get-observasi", observasiController.getObservasi);

router.get("/profile", authenticate, authController.profile);
// router.get("/users", authController.getAllUsers); // 🔹 ini route baru

router.get("/soals", soalController.getAllSoals); // 🔹 ini route baru

router.post("/import", importQuestions);
module.exports = router;
