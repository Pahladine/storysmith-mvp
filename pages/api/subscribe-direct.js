import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  const filePath = path.join(process.cwd(), 'data', 'subscribers.json');

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const subscribers = JSON.parse(fileContents);

    // Check if the email already exists to avoid duplicates
    if (subscribers.some(sub => sub.email === email)) {
      return res.status(409).json({ message: 'Email already subscribed.' });
    }

    // Add the new email with a timestamp
    subscribers.push({ email, subscribedAt: new Date().toISOString() });

    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

    return res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('File system error:', error);
    return res.status(500).json({ message: 'Server error during subscription.' });
  }
}