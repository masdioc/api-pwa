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
exports.getObservasi = async (req, res) => {
  const { userId } = req.body;

  // Validasi input
  if (!userId) {
    return res.status(400).json({ message: "userId wajib dikirim" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        pm.user_id,
        pm.observasi_id,
        ro.observasi,
        pm.status_praktek,
        pm.status_teori,
        pm.updated_at
      FROM progres_murid pm
      JOIN ref_observasi ro ON pm.observasi_id = ro.id
      WHERE pm.user_id = ?
      ORDER BY ro.id
      `,
      [userId]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error("❌ Gagal ambil data observasi:", err);
    res.status(500).json({ message: "Gagal mengambil data observasi" });
  }
};
exports.updateObservasi = async (req, res) => {
  const { user_id, observasi_id, status_praktek, status_teori } = req.body;

  if (!user_id || !observasi_id) {
    return res
      .status(400)
      .json({ message: "user_id dan observasi_id wajib dikirim" });
  }

  // Siapkan bagian SET query sesuai input yang dikirim
  const updates = [];
  const values = [];

  if (status_praktek !== undefined) {
    updates.push("status_praktek = ?");
    values.push(status_praktek);
  }

  if (status_teori !== undefined) {
    updates.push("status_teori = ?");
    values.push(status_teori);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "Tidak ada data yang diperbarui" });
  }

  // Tambahkan kondisi WHERE
  values.push(user_id, observasi_id);

  try {
    await db.query(
      `UPDATE progres_murid SET ${updates.join(
        ", "
      )} WHERE user_id = ? AND observasi_id = ?`,
      values
    );

    res.json({ message: "✅ Status observasi berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal update validasi:", err);
    res.status(500).json({ message: "❌ Gagal update status observasi" });
  }
};
