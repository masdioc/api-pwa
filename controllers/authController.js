// 📁 /controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = process.env.JWT_SECRET || "rahasia_super_aman";

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (existing.length > 0) return res.status(400).json({ message: "Username sudah digunakan" });

  const hashed = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);

  res.status(201).json({ message: "Registrasi berhasil" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  const user = rows[0];
  if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Password salah" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login berhasil", token });
};

exports.profile = async (req, res) => {
  res.json({ message: "Data profil", user: req.user });
};
