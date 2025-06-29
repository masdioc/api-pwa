// 📁 /controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = process.env.JWT_SECRET || "rahasia_super_aman";

exports.register = async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    level,
    role,
    province_id,
    regence_id,
    district_id,
    village_id,
  } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Username sudah digunakan" });

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password, name, email, level,role,province_id,regence_id,district_id,village_id) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)",
      [
        username,
        hashed,
        name,
        email,
        level,
        role,
        province_id,
        regence_id,
        district_id,
        village_id,
      ]
    );

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("Gagal register:", err);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT 
        u.*,
        p.name AS provinsi_nama,
        r.name AS kabupaten_nama,
        d.name AS kecamatan_nama,
        v.name AS desa_nama
      FROM users u
      LEFT JOIN provinces p ON u.province_id = p.code
      LEFT JOIN regencies r ON u.regence_id = r.code
      LEFT JOIN subdistricts d ON u.district_id = d.code
      LEFT JOIN villages v ON u.village_id = v.code
      WHERE u.username = ?`,
      [username]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        level: user.level,
        role: user.role,
        photo: user.photo,
        provinsi_id: user.provinsi_id,
        kabupaten_id: user.kabupaten_id,
        kecamatan_id: user.kecamatan_id,
        desa_id: user.desa_id,
        provinsi_nama: user.provinsi_nama,
        kabupaten_nama: user.kabupaten_nama,
        kecamatan_nama: user.kecamatan_nama,
        desa_nama: user.desa_nama,
      },
    });
  } catch (err) {
    console.error("Gagal login:", err);
    res.status(500).json({ message: "Gagal login" });
  }
};

exports.profile = async (req, res) => {
  res.json({ message: "Data profil", user: req.user });
};

exports.hafalan = async (req, res) => {
  const { user_id, surah_nomor, surah_nama } = req.body;

  try {
    db.query(
      "INSERT INTO hafalan_surah (user_id, surah_nomor, surah_nama) VALUES (?, ?, ?)",
      [user_id, surah_nomor, surah_nama],
      (err) => {
        if (err) return res.status(500).json({ error: "Gagal menyimpan" });
        res.json({ message: "Berhasil disimpan" });
      }
    );

    res.status(201).json({ message: "Hafalan berhasil" });
  } catch (err) {
    console.error("Gagal register:", err);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
};
exports.updatePassword = async (req, res) => {
  const { id, current, newpass } = req.body;

  if (!id || !current || !newpass) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      id,
    ]);
    const user = rows[0];

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(current, user.password);
    if (!match) return res.status(401).json({ message: "Password lama salah" });

    const hashed = await bcrypt.hash(newpass, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);

    res.json({ message: "Password berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal update password:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updatePhoto = async (req, res) => {
  const userId = req.body.user_id; // dari form-data (bisa juga dari token)
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({ error: "user_id dan photo wajib diisi" });
  }

  try {
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    // Simpan ke MySQL
    await db.query("UPDATE users SET photo = ? WHERE id = ?", [
      base64String,
      userId,
    ]);

    res.json({
      message: "Foto berhasil disimpan ke database.",
      photo_base64: base64String,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Gagal menyimpan ke database." });
  }
};
