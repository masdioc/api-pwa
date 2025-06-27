const db = require("../config/db");
// const util = require("util");
// const query = util.promisify(db.query).bind(db); // 🔄 Promisify

// GET modules
exports.getModules = async (req, res) => {
  try {
    const { course_id } = req.query;
    const sql = course_id
      ? "SELECT * FROM modules WHERE course_id = ? ORDER BY order_index"
      : "SELECT * FROM modules ORDER BY course_id, order_index";

    const [rows] = await db.query(sql, course_id ? [course_id] : []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE module
exports.createModule = async (req, res) => {
  try {
    const { title, order_index, course_id } = req.body;
    if (!title || !order_index || !course_id) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }
    const result = await db.query(
      "INSERT INTO modules (title, order_index, course_id) VALUES (?, ?, ?)",
      [title, order_index, course_id]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      order_index,
      course_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE module
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM modules WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json({ message: "Module deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE module
exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order_index, course_id } = req.body;
    const sql =
      "UPDATE modules SET title = ?, order_index = ?, course_id = ? WHERE id = ?";

    await db.query(sql, [title, order_index, course_id, id]);
    res.json({ message: "Module updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
