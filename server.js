import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are BMGDollarsTech Hub AI assistant." },
        { role: "user", content: userMessage }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "AI error. Try again." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

