const fs = require("fs");
const path = require("path");

const folder = "./audio"; // ganti dengan nama folder kamu

fs.readdirSync(folder).forEach((file) => {
  if (!file.endsWith(".mp3")) return;

  const oldPath = path.join(folder, file);

  // Ambil nomor saja (misalnya dari 001.mp3 → 001)
  const match = file.match(/^(\d+)\.mp3$/);
  if (!match) {
    console.warn(`⛔ Lewati: ${file}`);
    return;
  }

  const number = parseInt(match[1], 10); // hilangkan leading zero
  const newFileName = `${number}.mp3`;
  const newPath = path.join(folder, newFileName);

  fs.renameSync(oldPath, newPath);
  console.log(`✅ ${file} → ${newFileName}`);
});
