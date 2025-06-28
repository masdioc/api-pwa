const db = require("../../config/db");

exports.getProvinces = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM provinces");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegencies = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM regencies WHERE province_code = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM subdistricts WHERE regence_code = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVillages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM villages WHERE subdistrict_code = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
