const db = require("../config/db");
const { validationResult } = require("express-validator");

exports.getUserById = async (req, res) => {
  // contoh di Express
  const userId = req.params.id;
  const [result] = await db.query(
    `
   SELECT u.id,u.username,u.name,u.email,u.level,u.role,u.photo, 
   p.code AS provinsi_id,    
   p.name AS provinsi_nama, 
   r.code AS kabupaten_id,    
      r.name AS kabupaten_nama, 
      d.code AS kecamatan_id,
      d.name AS kecamatan_nama, 
      v.code AS desa_id,
      v.name AS desa_nama 
    FROM users u
    LEFT JOIN provinces p ON u.province_id = p.code
    LEFT JOIN regencies r ON u.regence_id = r.code
    LEFT JOIN subdistricts d ON u.district_id = d.code
    LEFT JOIN villages v ON u.village_id = v.code
    WHERE u.id = ?
  `,
    [userId]
  );

  res.json(result[0]);
};

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

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { name, email, province_id, regence_id, district_id, village_id } =
    req.body;

  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, province_id = ?, regence_id = ?, district_id = ?, village_id = ? WHERE id = ?",
      [name, email, province_id, regence_id, district_id, village_id, id]
    );
    res.json({ message: "Course updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
