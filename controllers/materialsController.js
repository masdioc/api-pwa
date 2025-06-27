// 📁 controllers/materialsController.js
const db = require("../config/db");

// ✅ GET all materials (optionally by module_id)
exports.getMaterials = async (req, res) => {
  try {
    const { module_id } = req.query;
    const sql = module_id
      ? "SELECT * FROM materials WHERE module_id = ? ORDER BY id"
      : "SELECT * FROM materials ORDER BY module_id, id";

    const [result] = await db.query(sql, module_id ? [module_id] : []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST new material
exports.createMaterial = async (req, res) => {
  try {
    const { title, content, module_id } = req.body;
    const sql =
      "INSERT INTO materials (title, content, module_id) VALUES (?, ?, ?)";

    const [result] = await db.query(sql, [title, content, module_id]);
    res.status(201).json({
      id: result.insertId,
      title,
      content,
      module_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT update material
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, module_id } = req.body;
    const sql =
      "UPDATE materials SET title = ?, content = ?, module_id = ? WHERE id = ?";

    await db.query(sql, [title, content, module_id, id]);
    res.json({ message: "Material updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM materials WHERE id = ?", [id]);
    res.json({ message: "Material deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
