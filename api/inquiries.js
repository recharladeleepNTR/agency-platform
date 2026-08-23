// 24/7 Vercel Serverless Cloud Endpoint for Lazydition Inquiries
let globalInquiries = [
  {
    _id: 'inq_demo_1',
    name: 'Deleep Prasad R',
    email: 'deleepdgreat@gmail.com',
    country: 'India',
    serviceType: 'Short-form editing',
    platform: 'Twitter / X',
    contentDetails: 'Short-form reels & shorts',
    volume: '1 Per week',
    budget: 'Custom',
    message: 'Interested in short form video editing.',
    createdAt: new Date().toISOString(),
    status: 'New'
  }
];

export default function handler(req, res) {
  // CORS Headers for cross-origin mobile & desktop requests
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

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const newInquiry = {
        _id: data._id || ('inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
        name: data.name || 'Anonymous Client',
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

      // Prevent duplicate additions
      if (!globalInquiries.some(i => i._id === newInquiry._id || (i.email === newInquiry.email && i.name === newInquiry.name))) {
        globalInquiries.unshift(newInquiry);
      }

      return res.status(200).json({ success: true, inquiry: newInquiry, data: globalInquiries });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (id) {
        globalInquiries = globalInquiries.filter(i => i._id !== id && i.id !== id);
      }
      return res.status(200).json({ success: true, data: globalInquiries });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: globalInquiries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
