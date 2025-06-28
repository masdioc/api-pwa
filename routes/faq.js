const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const { body, param } = require("express-validator");

// CRUD Routes
router.get("/", faqController.getAllFaqs);
router.get("/:id", faqController.getFaqById);
router.post("/", faqController.createFaq);
router.put("/:id", faqController.updateFaq);
router.delete("/:id", faqController.deleteFaq);
module.exports = router;
