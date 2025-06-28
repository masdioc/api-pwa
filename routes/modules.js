const express = require("express");
const router = express.Router();
const modulesController = require("../controllers/modulesController");

// GET /api/modules
router.get("/", modulesController.getModules);

// POST /api/modules
router.post("/", modulesController.createModule);

// PUT /api/modules/:id
router.put("/:id", modulesController.updateModule);

// DELETE /api/modules/:id
router.delete("/:id", modulesController.deleteModule);

router.get("/:id/materials", modulesController.getModuleMaterials);
module.exports = router;
