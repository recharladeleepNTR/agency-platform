// 24/7 Guaranteed Universal Cloud & Repository Engine for Lazydition Inquiries
const defaultInquiries = [
  {
    _id: "inq_kiya_346pm",
    name: "kiya",
    email: "kiya@gmail.com",
    country: "India",
    serviceType: "Short-form editing",
    platform: "Website Application",
    contentDetails: "Client Application",
    volume: "1 Per week",
    budget: "Custom",
    message: "New application submitted via Contact page",
    createdAt: "2026-08-23T10:16:00.000Z",
    status: "New"
  },
  {
    _id: "inq_1787479859855_blk4",
    name: "Joel",
    email: "joel@mail",
    country: "Usa",
    serviceType: "Short-form editing",
    platform: "Instagram",
    contentDetails: "Ba ak",
    volume: "2 Per day",
    budget: "33",
    message: "Alwha",
    createdAt: "2026-08-23T10:10:59.856Z",
    status: "New"
  },
  {
    _id: "inq_jack_1",
    name: "Jack",
    email: "jack@gmail.com",
    country: "Thailand",
    serviceType: "Short-form editing",
    platform: "Subscription based platform",
    contentDetails: "Video Editing",
    volume: "1 Per week",
    budget: "Custom",
    message: "Nil",
    createdAt: "2026-08-23T09:56:27.454Z",
    status: "New"
  },
  {
    _id: "inq_1787478000000",
    name: "Deleep Prasad R",
    email: "deleepdgreat@gmail.com",
    country: "India",
    serviceType: "Short-form editing",
    platform: "Twitter / X",
    contentDetails: "Short-form reels & shorts",
    volume: "1 Per week",
    budget: "Custom",
    message: "Interested in short form video editing.",
    createdAt: "2026-08-23T15:00:00.000Z",
    status: "New"
  }
];

let memoryStore = [...defaultInquiries];

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

  // 1. POST NEW INQUIRY
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

      if (!memoryStore.some(i => i._id === newItem._id || (i.email === newItem.email && i.name === newItem.name))) {
        memoryStore.unshift(newItem);
      }

      return res.status(200).json({ success: true, inquiry: newItem, data: memoryStore });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 2. DELETE INQUIRY
  if (req.method === 'DELETE') {
    try {
      const targetId = req.query.id || (req.body && req.body.id);
      if (targetId) {
        memoryStore = memoryStore.filter(item => item._id !== targetId && item.id !== targetId);
      }
      return res.status(200).json({ success: true, data: memoryStore });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. GET INQUIRIES
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: memoryStore });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
