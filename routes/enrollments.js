const express = require("express");
const { body, param } = require("express-validator");
const db = require("../config/db");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentsController");

router.get("/", enrollmentController.getAllEnrollments);
router.post("/", enrollmentController.createEnrollment);
router.delete("/:id", enrollmentController.deleteEnrollment);

module.exports = router;
