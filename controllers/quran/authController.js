// quranAuth.js
const axios = require("axios");
const qs = require("qs");

exports.getAccessToken = async (req, res) => {
  const data = qs.stringify({
    grant_type: "client_credentials",
    scope: "content",
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://oauth2.quran.foundation/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic N2U5NzA1ZTUtZmMwNS00NzI5LTg2Y2UtMzEyZDRiMWFjYzg0OnpMbDB1fllieTc0ZjFPR3hiODdRVGh0X2tL",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    res.json(response.data);
    // return response.data; // return access_token & metadata
  } catch (error) {
    console.error("Gagal ambil token:", error.response?.data || error.message);
    throw error;
  }
};
