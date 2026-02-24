export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON', detail: String(e) });
    }

    const email = body?.email;
    if (!email) return res.status(400).json({ error: 'No email provided', body: body });

    const token = process.env.AIRTABLE_TOKEN;
    if (!token) return res.status(500).json({ error: 'AIRTABLE_TOKEN env var not set' });

    const airtableUrl = 'https://api.airtable.com/v0/appereEkBMcZhsuCG/tblWv7uliV7eqZaiF';
    
    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Email': String(email),
          }
        }]
      }),
    });

    const airtableBody = await airtableRes.text();
    
    if (airtableRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ 
        error: 'Airtable rejected the request',
        status: airtableRes.status,
        detail: airtableBody
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
