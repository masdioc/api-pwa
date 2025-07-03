const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://verses.quran.foundation/Alafasy/mp3";
const OUTPUT_FILE = path.join(__dirname, "durasi-ayat.json");

const ayatPerSurah = [
  0, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54,
  45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62,
  55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28,
  20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6,
];

let totalDurationMs = 0;
let processed = 0;

const hasilDurasi = [];

async function fetchDuration(url) {
  try {
    const { parseStream } = await import("music-metadata");
    const { data } = await axios.get(url, { responseType: "stream" });
    const metadata = await parseStream(data, null, { duration: true });
    return metadata.format.duration * 1000; // convert ke milidetik
  } catch (err) {
    console.log(`❌ Gagal: ${url}`);
    return 0;
  }
}

(async () => {
  for (let surah = 1; surah <= 114; surah++) {
    for (let ayah = 1; ayah <= ayatPerSurah[surah]; ayah++) {
      const s = String(surah).padStart(3, "0");
      const a = String(ayah).padStart(3, "0");
      const id = `${s}${a}`;
      const url = `${BASE_URL}/${id}.mp3`;

      const durasiMs = await fetchDuration(url);
      totalDurationMs += durasiMs;
      processed++;

      hasilDurasi.push({
        no_surah: surah,
        no_ayah: ayah,
        durasi_ms: Math.round(durasiMs),
        url_audio: url,
      });

      console.log(`✅ ${id} = ${Math.round(durasiMs)} ms`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(hasilDurasi, null, 2));
  console.log(`\n✅ Selesai. ${processed} ayat disimpan ke: ${OUTPUT_FILE}`);
  console.log(
    `⏱️ Total durasi: ${(totalDurationMs / 1000 / 60).toFixed(2)} menit`
  );
})();
