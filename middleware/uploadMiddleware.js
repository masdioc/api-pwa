const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now();
    cb(null, `user-${unique}${ext}`);
  },
});

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const isImage = file.mimetype.startsWith("image/");
//     cb(null, isImage);
//   },
// });
const upload = multer({
  storage: multer.memoryStorage(), // penting! simpan di memory (bukan file)
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    cb(null, isImage);
  },
});

module.exports = upload;
