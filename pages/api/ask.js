// pages/api/ask.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "Missing user message" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = chatResponse.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
