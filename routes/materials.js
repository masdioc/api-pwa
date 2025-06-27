const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialsController");

router.get("/", materialController.getMaterials);
router.post("/", materialController.createMaterial);
router.put("/:id", materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
