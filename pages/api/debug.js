// pages/api/debug.js

export default function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  res.status(200).json({
    keyStartsWith: apiKey?.slice(0, 8) || null,
    keyEndsWith: apiKey?.slice(-8) || null,
    keyLength: apiKey?.length || 0,
    environment: process.env.NODE_ENV,
  });
}
