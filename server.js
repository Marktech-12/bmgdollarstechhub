import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); // allow cross-origin requests
app.use(express.json());
app.use(express.static("public"));

const memory = {};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!userId) return res.status(400).json({ reply: "Missing userId" });

    if (!memory[userId]) memory[userId] = [];
    memory[userId].push({ role: "user", content: message });

    console.log("User:", userId, "Message:", message);

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
    memory[userId].push({ role: "assistant", content: aiMessage });
    res.json({ reply: aiMessage });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ reply: "AI error. Try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
