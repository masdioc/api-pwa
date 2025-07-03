const axios = require("axios");

exports.getChapters = async (req, res) => {
  const { accessToken, clientId } = req.body;
  try {
    const response = await axios({
      method: "get",
      url: "https://apis.quran.foundation/content/api/v4/chapters",
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};

exports.getAudio = async (req, res) => {
  const { accessToken, clientId } = req.body;
  const pembaca = 7;
  const surah = 113;
  try {
    const response = await axios({
      method: "get",
      url: `https://apis.quran.foundation/content/api/v4/recitations/${pembaca}/by_chapter/${surah}`,
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};

exports.getModelPembaca = async (req, res) => {
  const { accessToken, clientId } = req.body;
  //   const pembaca = 1;
  //   const surah = 113;
  try {
    const response = await axios({
      method: "get",
      url: `https://apis.quran.foundation/content/api/v4/resources/recitations`,
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};
