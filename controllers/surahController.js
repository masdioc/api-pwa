const db = require("../config/db");
exports.saveLastRead = async (req, res) => {
  const { user_id, surah_nomor, surah_nama, ayat_nomor } = req.body;

  try {
    // upsert (jika user sudah ada, update)
    await db.query(
      `INSERT INTO last_read (user_id, surah_nomor, surah_nama, ayat_nomor)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         surah_nomor = VALUES(surah_nomor),
         surah_nama = VALUES(surah_nama),
         ayat_nomor = VALUES(ayat_nomor),
         updated_at = CURRENT_TIMESTAMP`,
      [user_id, surah_nomor, surah_nama, ayat_nomor]
    );

    res.json({ message: "Disimpan sebagai terakhir dibaca" });
  } catch (err) {
    console.error("Gagal simpan last_read:", err);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
};
exports.getLastRead = async (req, res) => {
  const { user_id } = req.query;

  try {
    const [rows] = await db.query(
      "SELECT * FROM last_read WHERE user_id = ? LIMIT 1",
      [user_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada data terakhir dibaca" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Gagal ambil last_read:", err);
    res.status(500).json({ message: "Gagal ambil data" });
  }
};
exports.getAllLastRead = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT user_id, name, username, surah_nomor, surah_nama, ayat_nomor, updated_at, status_validasi
FROM last_read
JOIN users ON last_read.user_id = users.id
ORDER BY last_read.updated_at DESC;

    `);

    res.json({ data: rows });
  } catch (err) {
    console.error("Gagal ambil data last_read:", err);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
};
exports.updateLastReadStatus = async (req, res) => {
  const { user_id, surah_nomor, ayat_nomor, status_validasi } = req.body;

  // if (!["baik", "benar", "kurang"].includes(status_validasi)) {
  //   return res.status(400).json({ message: "Status tidak valid" });
  // }

  try {
    await db.query(
      `UPDATE last_read SET status_validasi = ? WHERE user_id = ? AND surah_nomor = ? and ayat_nomor=?`,
      [status_validasi, user_id, surah_nomor, ayat_nomor]
    );
    res.json({ message: "Status validasi diperbarui" });
  } catch (err) {
    console.error("Gagal update validasi:", err);
    res.status(500).json({ message: "Gagal update status" });
  }
};
