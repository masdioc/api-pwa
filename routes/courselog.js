const express = require("express");
const router = express.Router();
const courselogController = require("../controllers/courseslogController");
const { body, param } = require("express-validator");

// CRUD Routes
router.get("/", courselogController.getAllCoursesLog);
router.get("/:id", courselogController.getCourseLogById);
router.post("/", courselogController.createCourseLog);
router.put("/:id", courselogController.updateCourseLog);
router.delete("/:id", courselogController.deleteCourseLog);

router.get("/:id/recap", courselogController.recapCourseLog);

module.exports = router;
