const db = require("../config/db");
const { validationResult } = require("express-validator");

// controllers/course_logsController.js

exports.getAllCoursesLog = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM course_logs"
    );
    const [rows] = await db.query(
      "SELECT * FROM course_logs ORDER BY id DESC LIMIT ? OFFSET ?",
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

exports.getCourseLogById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM course_logs WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Course Log not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourseLog = async (req, res) => {
  try {
    const { user_id, material_id, tanggal, durasi, status } = req.body;

    const [existing] = await db.query(
      "SELECT id FROM course_logs WHERE user_id = ? AND material_id = ? AND tanggal = ?",
      [user_id, material_id, tanggal]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE course_logs SET durasi = ?, status = ? WHERE id = ?",
        [durasi, status, existing[0].id]
      );
      return res.json({ updated: true });
    } else {
      await db.query(
        "INSERT INTO course_logs (user_id, material_id, tanggal, durasi, status) VALUES (?, ?, ?, ?, ?)",
        [user_id, material_id, tanggal, durasi, status]
      );
      return res.json({ inserted: true });
    }
  } catch (error) {
    console.error("❌ Error in createCourseLog:", error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.recapCourseLog = async (req, res) => {
  const userId = req.params.id;
  try {
    const [logs] = await db.query(
      `SELECT tanggal, SUM(durasi) AS durasi 
       FROM course_logs 
       WHERE user_id = ? 
       GROUP BY tanggal 
       ORDER BY tanggal`,
      [userId]
    );
    res.json(logs);
  } catch (error) {
    console.error("❌ Error log_belajar:", error);
    res.status(500).json({ error: "Gagal mengambil data log belajar" });
  }
};
exports.recaptableCourseLog = async (req, res) => {
  const { guru_id } = req.query;

  // if (!guru_id) {
  //   return res.status(400).json({ error: "Parameter guru_id wajib diisi" });
  // }

  try {
    const [rows] = await db.query(
      `SELECT 
         l.tanggal, 
         u.name AS nama_siswa, 
         m.title, 
         l.durasi 
       FROM course_logs l
        JOIN users u ON l.user_id = u.id      
		  JOIN materials m ON l.material_id = m.id
       ORDER BY l.tanggal DESC, u.name ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Gagal ambil log belajar:", error);
    res.status(500).json({ error: "Gagal mengambil data log belajar" });
  }
};
// exports.createCourseLog = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty())
//     return res.status(400).json({ errors: errors.array() });

//   const { user_id, material_id, tanggal, durasi, status, feedback } = req.body;
//   try {
//     const [result] = await db.query(
//       "INSERT INTO course_logs (user_id, material_id, tanggal,durasi,status,feedback) VALUES (?, ?, ?,?,?,?)",
//       [user_id, material_id, tanggal, durasi, status, feedback]
//     );
//     res
//       .status(201)
//       .json({ message: "Course Log created", id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateCourseLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { title, description, teacher_id } = req.body;

  try {
    await db.query(
      "UPDATE course_logs SET title = ?, description = ?, teacher_id = ? WHERE id = ?",
      [title, description, teacher_id, id]
    );
    res.json({ message: "Course Log updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourseLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    await db.query("DELETE FROM course_logs WHERE id = ?", [id]);
    res.json({ message: "Course Log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
