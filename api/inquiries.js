// 24/7 Universal Cloud Endpoint for Lazydition Inquiries
let cloudInquiries = [];

export default function handler(req, res) {
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

      // Deduplicate
      if (!cloudInquiries.some(i => i._id === newItem._id || (i.email === newItem.email && i.name === newItem.name))) {
        cloudInquiries.unshift(newItem);
      }

      return res.status(200).json({ success: true, inquiry: newItem, data: cloudInquiries });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 2. DELETE INQUIRY
  if (req.method === 'DELETE') {
    try {
      const targetId = req.query.id || (req.body && req.body.id);
      if (targetId) {
        cloudInquiries = cloudInquiries.filter(item => item._id !== targetId && item.id !== targetId);
      }
      return res.status(200).json({ success: true, data: cloudInquiries });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. FETCH ALL INQUIRIES
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: cloudInquiries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
