const db = require("../config/db");
const { validationResult } = require("express-validator");

// controllers/FaqsController.js

exports.getAllFaqs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faq ORDER BY id");
    res.json({
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFaqById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM faq WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Faq not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFaq = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { kategori, pertanyaan, jawaban } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO faq (kategori, pertanyaan, jawaban) VALUES (?, ?, ?)",
      [kategori, pertanyaan, jawaban]
    );
    res.status(201).json({ message: "Faq created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFaq = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { title, description, teacher_id } = req.body;

  try {
    await db.query(
      "UPDATE faq SET kategori = ?, pertanyaan = ?, jawaban = ? WHERE id = ?",
      [title, description, teacher_id, id]
    );
    res.json({ message: "Faq updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFaq = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    await db.query("DELETE FROM faq WHERE id = ?", [id]);
    res.json({ message: "Faq deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
