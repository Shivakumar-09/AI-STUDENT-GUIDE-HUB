const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 3 Flash Preview (confirmed working)
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 1.0, // Recommended for Gemini 3
    }
});

const getGeminiResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (error.message.includes("429")) {
            throw new Error("AI service is currently busy (Rate Limit). Please wait a few seconds.");
        }
        throw error;
    }
};

const getGeminiChatResponse = async (history, message) => {
    try {
        let validHistory = [];
        if (Array.isArray(history)) {
            validHistory = history
                .filter(h => h.role && h.parts)
                .map(h => ({
                    role: h.role === "model" ? "model" : "user",
                    parts: [{ text: h.parts[0]?.text || "" }]
                }));
        }

        if (validHistory.length > 0 && validHistory[0].role !== "user") {
            validHistory.shift();
        }

        const chat = model.startChat({ history: validHistory });
        const result = await chat.sendMessage(message);
        return result.response.text();

    } catch (error) {
        console.error("Gemini Chat Error:", error.message);
        if (error.message.includes("429")) {
            return "🤖 AI service is currently busy. Please wait 30-60 seconds and try again.";
        }
        return "🤖 AI service temporarily unavailable. Check backend logs.";
    }
};

module.exports = { getGeminiResponse, getGeminiChatResponse };
