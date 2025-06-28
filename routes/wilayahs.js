const express = require("express");
const router = express.Router();
const wilayahsController = require("../controllers/wilayah/wilayahsController");

// CRUD Routes
router.get("/provinces", wilayahsController.getProvinces);
router.get("/provinces/:id/regencies", wilayahsController.getRegencies);
router.get("/regencies/:id/districts", wilayahsController.getDistricts);
router.get("/districts/:id/villages", wilayahsController.getVillages);

module.exports = router;
