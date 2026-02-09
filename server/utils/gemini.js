const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Reverting to standard model
});

const getGeminiResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error details:", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        throw error;
    }
};

const getGeminiChatResponse = async (history, message) => {
    let validHistory = [];
    try {
        validHistory = Array.isArray(history) ? history.filter(h => h.role && h.parts) : [];

        // Gemini requires first message to be from user
        while (validHistory.length > 0 && validHistory[0].role !== "user") {
            validHistory.shift();
        }

        const chat = model.startChat({
            history: validHistory,
        });

        const result = await chat.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Chat API Error details:", {
            message: error.message,
            stack: error.stack,
            history: validHistory,
            messageSent: message
        });
        throw error;
    }
};

module.exports = { getGeminiResponse, getGeminiChatResponse };
