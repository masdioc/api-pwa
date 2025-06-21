
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
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`) );

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// 📄 .env file (buat di root folder project)
// DB_HOST=localhost
// DB_USER=root
// DB_PASS=
// DB_NAME=auth_demo
// JWT_SECRET=super_secret_key
// PORT=3000
