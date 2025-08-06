// pages/api/generateImage.js

import OpenAI from 'openai';

// Make sure your OPENAI_API_KEY is set in your environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error("DALL-E API Error:", error.message);
    res.status(500).json({ message: 'Failed to generate image', error: error.message });
  }
}