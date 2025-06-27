const db = require("../config/db");
const { validationResult } = require("express-validator");

// controllers/enrollmentsController.js
exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name AS student_name, u.email, c.title AS course_title, e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEnrollment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { user_id, course_id } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [user_id, course_id]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Siswa sudah terdaftar di kursus ini" });
    }

    const [result] = await db.query(
      "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
      [user_id, course_id]
    );
    res
      .status(201)
      .json({ message: "Pendaftaran berhasil", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    await db.query("DELETE FROM enrollments WHERE id = ?", [id]);
    res.json({ message: "Pendaftaran dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
