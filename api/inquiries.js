// 24/7 Universal Cloud Database Engine for Lazydition Inquiries
const CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a02e0c367d001b';

async function getCloudInquiries() {
  try {
    const res = await fetch(CLOUD_DB_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.inquiries)) {
        return json.data.inquiries;
      }
    }
  } catch (e) {
    console.error('[Cloud DB Read Error]:', e);
  }
  return [];
}

async function saveCloudInquiries(inquiries) {
  try {
    await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lazydition Inquiries Store',
        data: { inquiries }
      })
    });
  } catch (e) {
    console.error('[Cloud DB Save Error]:', e);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. ADD NEW INQUIRY
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const newItem = {
        _id: data._id || ('inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        name: data.name || 'Client',
        email: data.email || 'N/A',
        country: data.country || 'N/A',
        serviceType: data.serviceType || 'N/A',
        platform: data.platform || 'N/A',
        contentDetails: data.contentDetails || 'N/A',
        volume: data.volume || '1 Per week',
        budget: data.budget || 'Not specified',
        message: data.message || 'N/A',
        createdAt: data.createdAt || new Date().toISOString(),
        status: 'New'
      };

      const current = await getCloudInquiries();
      // Deduplicate by ID or email/name combo
      if (!current.some(i => i._id === newItem._id || (i.email === newItem.email && i.name === newItem.name))) {
        current.unshift(newItem);
        await saveCloudInquiries(current);
      }

      return res.status(200).json({ success: true, inquiry: newItem, data: current });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 2. DELETE INQUIRY
  if (req.method === 'DELETE') {
    try {
      const targetId = req.query.id || (req.body && req.body.id);
      let current = await getCloudInquiries();
      if (targetId) {
        current = current.filter(item => item._id !== targetId && item.id !== targetId);
        await saveCloudInquiries(current);
      }
      return res.status(200).json({ success: true, data: current });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. FETCH ALL INQUIRIES
  if (req.method === 'GET') {
    const inquiries = await getCloudInquiries();
    return res.status(200).json({ success: true, data: inquiries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
