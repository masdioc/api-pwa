const db = require("../config/db");
const { validationResult } = require("express-validator");

exports.getUsersByRole = async (req, res) => {
  const role = req.query.role;
  try {
    const [rows] = await db.query(
      "SELECT id, username, name, email, level,role,photo FROM users WHERE role = ?",
      [role]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
