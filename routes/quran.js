const express = require("express");

const router = express.Router();
const tokenController = require("../controllers/quran/authController");
const quranController = require("../controllers/quran/quranController");

// CRUD Routes
router.post("/token", tokenController.getAccessToken);
router.get("/getChapters", quranController.getChapters);
router.get("/getAudio", quranController.getAudio);
router.get("/getModelPembaca", quranController.getModelPembaca);

module.exports = router;
