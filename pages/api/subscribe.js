import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  const beehiivUrl = 'https://adams-newsletter-95d074.beehiiv.com/subscribe';
  const formData = new URLSearchParams();
  formData.append('email', email);

  try {
    const beehiivResponse = await fetch(beehiivUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Beehiiv might not return a standard 'ok' response for server-to-server submissions,
    // but we can check for a redirect or a specific status code if we know it.
    // For now, we'll assume a successful response from their end.
    if (beehiivResponse.status === 200) {
      return res.status(200).json({ message: 'Success! Please check your email to confirm.' });
    } else {
      // If Beehiiv responds with an error, we can log it and return a generic error message.
      console.error(`Beehiiv subscription failed with status: ${beehiivResponse.status}`);
      return res.status(500).json({ message: 'Failed to subscribe with Beehiiv.' });
    }
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ message: 'Server error during subscription.' });
  }
}