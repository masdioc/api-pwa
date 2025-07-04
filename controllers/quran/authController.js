// quranAuth.js
const axios = require("axios");
const qs = require("qs");

exports.getAccessToken = async (req, res) => {
  const { clientId, clientSecret } = req.body;

  const data = qs.stringify({
    grant_type: "client_credentials",
    scope: "content",
  });
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://oauth2.quran.foundation/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    console.error("Gagal ambil token:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gagal mendapatkan access token",
      detail: error.response?.data || error.message,
    });
  }
};
