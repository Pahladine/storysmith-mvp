import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  const sheetDbUrl = 'https://sheetdb.io/api/v1/7wb83q966x1q2';

  try {
    const sheetDbResponse = await fetch(sheetDbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          email: email,
          subscribedAt: new Date().toISOString()
        }]
      }),
    });

    if (sheetDbResponse.ok) {
      return res.status(200).json({ message: 'Successfully subscribed!' });
    } else {
      console.error(`SheetDB subscription failed with status: ${sheetDbResponse.status}`);
      return res.status(500).json({ message: 'Failed to subscribe with SheetDB.' });
    }
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ message: 'Server error during subscription.' });
  }
}