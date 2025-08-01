import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptPath = path.join(process.cwd(), 'prompts', '03_Bind_And_Preserve.txt');
const BIND_PROMPT = fs.readFileSync(promptPath, 'utf-8');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userMessage, storyState } = req.body;

  if (!userMessage || !storyState) {
    return res.status(400).json({ error: 'Missing storyState or userMessage' });
  }

  const formattedState = JSON.stringify(storyState, null, 2);

  const fullPrompt = `
${BIND_PROMPT}

Final story state:
${formattedState}

Guest message:
"${userMessage}"
`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are The Binder of Realms." },
        { role: "user", content: fullPrompt }
      ]
    });

    const reply = chatResponse.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: err.message || 'Failed to finalize storybook.' });
  }
}
