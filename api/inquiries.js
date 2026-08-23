// 24/7 Vercel Serverless API Endpoint for Lazydition Client Inquiries
let cloudInquiries = [
  {
    _id: 'sample_1',
    name: 'Welcome Inquiry',
    email: 'client@example.com',
    country: 'United States',
    serviceType: 'Short-form editing',
    platform: 'YouTube',
    contentDetails: '9:16 Shorts & Reels content creation',
    volume: '3 Per week',
    budget: '$1,500 - $3,000',
    message: 'Looking for a dedicated video editing team for YouTube Shorts & Instagram Reels.',
    createdAt: new Date().toISOString(),
    status: 'New'
  }
];

export default function handler(req, res) {
  // Enable CORS headers for cross-device & mobile access
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
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newInquiry = {
        _id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
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

      cloudInquiries.unshift(newInquiry);
      return res.status(200).json({ success: true, inquiry: newInquiry, data: cloudInquiries });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: cloudInquiries });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
