const express = require("express");
const router = express.Router();
const courseController = require("../controllers/coursesController");
const { body, param } = require("express-validator");

// CRUD Routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
router.get("/enrollments/:user_id", courseController.getCoursesWithEnrollment);
router.get("/:user_id/full", courseController.getCoursesWithEnrollment);
// /api/courses/:id/full
module.exports = router;
