// pages/api/generateImage.js

import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from your environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ensure the API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server configuration error: OpenAI API key is missing." });
  }
  
  const { prompt } = req.body;

  // Ensure a prompt was provided in the request
  if (!prompt) {
    return res.status(400).json({ error: "A 'prompt' is required in the request body." });
  }

  try {
    // Make the API call to DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3", // Using the DALL-E 3 model
      prompt: prompt,    // The text prompt from the frontend
      n: 1,              // We only need one image
      size: "1024x1024",  // The size of the generated image
      quality: "standard", // Can be "standard" or "hd"
    });

    // Extract the image URL from the OpenAI response
    const imageUrl = response.data[0].url;

    // Send the image URL back to the frontend
    res.status(200).json({ imageUrl });

  } catch (error) {
    // Handle any errors from the OpenAI API
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: `Failed to generate image. ${error.message}` });
  }
}