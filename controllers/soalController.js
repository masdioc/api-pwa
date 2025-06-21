const db = require('../config/db'); 
exports.getAllSoals = async (req, res) => {
  try {
    const [soals] = await db.query("SELECT question,jenis_soal,level_soal,a,b,c,d,answer,explanation FROM questions ORDER BY id ASC");
    res.json({ soals });
  } catch (err) {
    console.error("Gagal mengambil data soal:", err);
    res.status(500).json({ message: "Gagal mengambil data soal" });
  }
}; 

// Simpan soal-soal dalam database atau array sementara
let soalDatabase = []; // Gantilah dengan koneksi database MySQL atau MongoDB jika ada

// Fungsi validasi soal
const isValidSoal = (soal) =>
  soal.question && soal.a && soal.b && soal.c && soal.d && soal.answer;
exports.importSoalExcel = async (req, res) => {
  const body = req.body;

  if (Array.isArray(body)) {
    const invalid = body.filter((item) => !isValidSoal(item));
    if (invalid.length > 0) {
      return res.status(400).json({ message: 'Beberapa soal tidak valid', invalid });
    }

    soalDatabase.push(...body);
    return res.json({ message: `${body.length} soal berhasil ditambahkan.` });
  }

  if (isValidSoal(body)) {
    soalDatabase.push(body);
    return res.json({ message: 'Soal berhasil ditambahkan.', soal: body });
  } else {
    return res.status(400).json({ message: 'Format soal tidak valid.' });
  }
};

module.exports = router;
