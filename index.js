// 📁 index.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

const cors = require("cors");

const app = express();

app.use(cors()); // 👈 Izinkan semua origin
app.use(express.json());

require("dotenv").config();

app.use(bodyParser.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;

const quranRoutes = require("./routes/quran");
app.use("/api/quran", quranRoutes);

const courselogRoutes = require("./routes/courselog");
app.use("/api/courselog", courselogRoutes);

const faqRoutes = require("./routes/faq");
app.use("/api/faq", faqRoutes);

const wilayahsRoutes = require("./routes/wilayahs");
app.use("/api/wilayahs", wilayahsRoutes);

const materialRoutes = require("./routes/materials");
app.use("/api/materials", materialRoutes);

const modRoutes = require("./routes/modules");
app.use("/api/modules", modRoutes);

const enrollmentRoutes = require("./routes/enrollments");
app.use("/api/enrollments", enrollmentRoutes);

const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);

const usersRoutes = require("./routes/users");
app.use("/api/users", usersRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

// app.listen(PORT, "192.168.0.108", () =>
//   console.log(`Server running on port ${PORT}`)
// );

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 📄 .env file (buat di root folder project)
// DB_HOST=localhost
// DB_USER=root
// DB_PASS=
// DB_NAME=auth_demo
// JWT_SECRET=super_secret_key
// PORT=3000
