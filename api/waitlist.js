export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = JSON.parse(req.body);

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const response = await fetch('https://api.airtable.com/v0/appereEkBMcZhsuCG/tblWv7uliV7eqZaiF', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Email': email,
            'Source': req.headers.origin || 'direct',
          }
        }]
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Airtable error' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
