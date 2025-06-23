const fs = require("fs");
const path = require("path");

const folder = "./output-surah"; // Ganti dengan nama folder kamu

for (let i = 1; i <= 114; i++) {
  const oldName = `surat${i}.json`;
  const newName = `surah${i}.json`;

  const oldPath = path.join(folder, oldName);
  const newPath = path.join(folder, newName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Rename: ${oldName} → ${newName}`);
  } else {
    console.warn(`⚠️ Tidak ditemukan: ${oldName}`);
  }
}
