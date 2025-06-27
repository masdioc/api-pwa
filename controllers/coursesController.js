const db = require("../config/db");
const { validationResult } = require("express-validator");

// controllers/coursesController.js

exports.getAllCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM courses"
    );
    const [rows] = await db.query(
      "SELECT * FROM courses ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Course not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, description, teacher_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)",
      [title, description, teacher_id]
    );
    res.status(201).json({ message: "Course created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { title, description, teacher_id } = req.body;

  try {
    await db.query(
      "UPDATE courses SET title = ?, description = ?, teacher_id = ? WHERE id = ?",
      [title, description, teacher_id, id]
    );
    res.json({ message: "Course updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    await db.query("DELETE FROM courses WHERE id = ?", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCoursesWithEnrollment = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
        c.id,
        c.title,
        c.description,
        u.name AS teacher_name,
        CASE 
          WHEN e.user_id IS NOT NULL THEN true
          ELSE false
        END AS enrolled
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET /api/courses/:id/full
exports.getCoursesWithModulesFull = async (req, res) => {
  // app.get("/api/courses/:id/full", async (req, res) => {
  const courseId = req.params.id;

  const course = await db.course.findUnique({
    where: { id: Number(courseId) },
    include: {
      modules: {
        orderBy: { order_index: "asc" },
        include: { materials: true },
      },
    },
  });

  res.json(course);
};
