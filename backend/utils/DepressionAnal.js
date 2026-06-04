const axios = require("axios");
require("dotenv").config({ path: __dirname + "../config/.env" });
const DepressionAnalysis = async (extractedText) => {
  if (!extractedText || extractedText.trim().length < 10) {
    return {
      depression_level: "No",
      confidence_score: 100,
      explanation: "Text too short for meaningful analysis",
      suggested_response: null,
    };
  }

  const mlResponse = await axios.post(process.env.ML_SERVICE_URL + "/predict", {
    text: extractedText,
  });


  return mlResponse.data;
};

module.exports = DepressionAnalysis;