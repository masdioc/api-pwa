const db = require("../config/db");
exports.create = async (req, res) => {
  const { user_id, observasi_id } = req.body;

  try {
    // upsert (jika user sudah ada, update)
    await db.query(
      `INSERT INTO progres_murid (user_id, observasi_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         user_id = VALUES(user_id),
         observasi_id = VALUES(observasi_id)
         updated_at = CURRENT_TIMESTAMP`,
      [user_id, observasi_id]
    );

    res.json({ message: "Disimpan sukses" });
  } catch (err) {
    console.error("Gagal simpan :", err);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
};
exports.generateObservasi = async (req, res) => {
  const { userId } = req.body;
  try {
    // Ambil semua observasi_id dari ref_observasi
    const [refObservasi] = await db.query("SELECT id FROM ref_observasi");

    // Ambil observasi_id yang sudah ada untuk user ini
    const [existingRows] = await db.query(
      "SELECT observasi_id FROM progres_murid WHERE user_id = ?",
      [userId]
    );

    const existingIds = new Set(existingRows.map((row) => row.observasi_id));

    // Filter hanya observasi yang belum dimasukkan
    const newObservasi = refObservasi
      .filter((row) => !existingIds.has(row.id))
      .map((row) => [userId, row.id]);

    if (newObservasi.length > 0) {
      await db.query(
        "INSERT INTO progres_murid (user_id, observasi_id) VALUES ?",
        [newObservasi]
      );
    }
    res.json(`Berhasil generate data observasi `);
  } catch (err) {
    console.error(err);
    res.status(500).json("Terjadi kesalahan saat generate data.");
  }
};
exports.getAllLProgres = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT ref_observasi.id,observasi,updated_at
FROM progres_murid
JOIN ref_observasi ON progres_murid.observasi_id = ref_observasi.id
ORDER BY ref_observasi.id;

    `);

    res.json({ data: rows });
  } catch (err) {
    console.error("Gagal ambil data last_read:", err);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
};
