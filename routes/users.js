const express = require("express");
const router = express.Router();
const { getUsersByRole } = require("../controllers/usersController");

router.get("/", getUsersByRole);

module.exports = router;
