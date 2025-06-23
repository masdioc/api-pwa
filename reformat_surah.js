const fs = require("fs");
const path = require("path");

const inputFolder = "./data-surah";    // folder berisi 1.json hingga 114.json
const outputFolder = "./output-surah"; // folder untuk hasil

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

for (let i = 1; i <= 114; i++) {
  const filePath = path.join(inputFolder, `${i}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File tidak ditemukan: ${i}.json`);
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  const ayat = json.verses.map((v) => ({
    arabic: v.text,
    latin: v.transliteration,
    translation: v.translation,
  }));

  const surahData = {
    nomor: String(json.id),
    nama: json.transliteration,
    ayat,
  };

  const outputFileName = `surat${i}.json`;
  const outputPath = path.join(outputFolder, outputFileName);
  fs.writeFileSync(outputPath, JSON.stringify(surahData, null, 2), "utf-8");
  console.log(`✅ Disimpan: ${outputFileName}`);
}
