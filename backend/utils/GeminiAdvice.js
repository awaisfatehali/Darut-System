const { GoogleGenerativeAI } = require("@google/generative-ai");

const GetAdvice = async (chatHistory) => {
  if (!chatHistory || chatHistory.length === 0) {
    return { advice: null };
  }

  // ── Extract user messages and ML predictions ──
  const pairs = [];

  for (let i = 0; i < chatHistory.length; i++) {
    if (chatHistory[i].role === "user") {
      const userText = chatHistory[i].content;
      const assistantResult = chatHistory[i + 1]?.content;

      if (assistantResult) {
        pairs.push({
          text: userText,
          prediction: assistantResult.prediction,
          confidence: Math.round(assistantResult.confidence * 100),
        });
      }
    }
  }

  // ── Build summary for Gemini ──
  const summary = pairs
    .map(
      (p, i) =>
        `Message ${i + 1}: "${p.text}" → ${p.prediction} (${p.confidence}% confidence)`,
    )
    .join("\n");

  console.log("Sending to Gemini:\n", summary);

  // ── Call Gemini ──
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const prompt = `
You are a compassionate mental health assistant who understands Roman Urdu and Urdu culture.

A depression detection model has analyzed a conversation from a user. Here are the results:

${summary}

Based on the overall pattern, provide personalized advice.
Return ONLY valid JSON (no markdown, no extra text):

{
  "overall_depression_level": "No Depression | Mild | Moderate | Severe",
  "explanation": "3-5 lines summarizing the overall pattern found across all messages",
  "suggested_response": "A warm, culturally sensitive message in Roman Urdu with practical advice the person can follow"
}
`;

  for (let modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Trying ${modelName} (Attempt ${attempt})`);

        const geminiModel = genAI.getGenerativeModel({ model: modelName });
        const result = await geminiModel.generateContent(prompt);
        const text = await result.response.text();
        const cleanJson = text.replace(/```json|```/g, "").trim();

        try {
          const data = JSON.parse(cleanJson);

          return {
            pairs,
            overall_depression_level: data.overall_depression_level,
            explanation: data.explanation,
            suggested_response: data.suggested_response,
          };
        } catch (parseError) {
          console.error("❌ JSON Parse Failed:", cleanJson);
          break;
        }
      } catch (err) {
        console.error(`❌ ${modelName} attempt ${attempt} failed`);

        console.error("FULL ERROR:");
        console.error(err);

        console.error("MESSAGE:", err.message);
        console.error("STATUS:", err.status);

        if (err.response) {
          console.error("RESPONSE:", err.response);
        }

        break;
      }
    }
  }

  // ── Fallback ──
  return {
    pairs,
    overall_depression_level: "Unknown",
    explanation: "Gemini unavailable",
    suggested_response: null,
  };
};

module.exports = GetAdvice;
