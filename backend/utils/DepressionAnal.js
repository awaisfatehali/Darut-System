const axios = require("axios");

const DepressionAnalysis = async (extractedText) => {
  if (!extractedText || extractedText.trim().length < 10) {
    return {
      depression_level: "No",
      confidence_score: 100,
      explanation: "Text too short for meaningful analysis",
      suggested_response: null,
    };
  }

  const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
    text: extractedText,
  });


  return mlResponse.data;
};

module.exports = DepressionAnalysis;