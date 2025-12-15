import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve your HTML

// In-memory conversation memory per user
const memory = {};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST endpoint for chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!userId) return res.status(400).json({ reply: "Missing userId" });

    if (!memory[userId]) memory[userId] = [];

    // Add user message to memory
    memory[userId].push({ role: "user", content: message });

    // AI response
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are BMGDollarsTech Hub AI Assistant.
You provide info on Tech, AI, Fashion, Cosmetics, and Salon services.
Be friendly, professional, and promote the brand naturally.
        `,
        },
        ...memory[userId],
      ],
    });

    const aiMessage = response.choices[0].message.content;

    // Store AI response in memory
    memory[userId].push({ role: "assistant", content: aiMessage });

    res.json({ reply: aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error. Try again." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
