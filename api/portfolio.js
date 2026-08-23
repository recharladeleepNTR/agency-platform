// 24/7 Vercel Serverless API for Lazydition Portfolio Media
const DEFAULT_PORTFOLIO = [
  // Work Previews
  { id: 'w1', title: 'Work Preview 1', subtitle: '9:16 Vertical Video', img: '/card_own_power.png', mediaUrl: '/card_own_power.png', ratio: 'Work Preview - Slot 1 (9:16 Vertical)', category: 'Work Preview' },
  { id: 'w2', title: 'Work Preview 2', subtitle: '16:9 Widescreen Video', img: '/card_own_power.png', mediaUrl: '/card_own_power.png', ratio: 'Work Preview - Slot 2 (16:9 Widescreen)', category: 'Work Preview' },
  { id: 'w3', title: 'Work Preview 3', subtitle: '4:5 Post Video', img: '/card_own_power.png', mediaUrl: '/card_own_power.png', ratio: 'Work Preview - Slot 3 (4:5 Post)', category: 'Work Preview' },

  // 4:5 Posters
  { id: 'p1', title: 'Work Poster 1', subtitle: 'Social Media Post', img: '/uploads/img_1787333949894_1jmf0.jpg', mediaUrl: '/uploads/img_1787333949894_1jmf0.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p2', title: 'Work Poster 2', subtitle: 'Social Media Post', img: '/uploads/img_1787333959824_d5d5t.jpg', mediaUrl: '/uploads/img_1787333959824_d5d5t.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p3', title: 'Work Poster 3', subtitle: 'Social Media Post', img: '/uploads/img_1787333971022_a6gxa.png', mediaUrl: '/uploads/img_1787333971022_a6gxa.png', ratio: '4:5', category: 'Design' },
  { id: 'p4', title: 'Work Poster 4', subtitle: 'Social Media Post', img: '/uploads/img_1787333981872_baixa.png', mediaUrl: '/uploads/img_1787333981872_baixa.png', ratio: '4:5', category: 'Design' },
  { id: 'p5', title: 'Work Poster 5', subtitle: 'Social Media Post', img: '/uploads/img_1787333992992_iyf98.jpg', mediaUrl: '/uploads/img_1787333992992_iyf98.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p6', title: 'Work Poster 6', subtitle: 'Social Media Post', img: '/uploads/img_1787334002671_273ss.jpg', mediaUrl: '/uploads/img_1787334002671_273ss.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p7', title: 'Work Poster 7', subtitle: 'Social Media Post', img: '/uploads/img_1787334017008_lj9un.jpg', mediaUrl: '/uploads/img_1787334017008_lj9un.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p8', title: 'Work Poster 8', subtitle: 'Social Media Post', img: '/uploads/img_1787334033661_lxfkj.jpg', mediaUrl: '/uploads/img_1787334033661_lxfkj.jpg', ratio: '4:5', category: 'Design' },

  // 16:9 Thumbnails
  { id: 't1', title: 'Widescreen Work 1', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787334805662_b1tw7.jpg', mediaUrl: '/uploads/img_1787334805662_b1tw7.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't2', title: 'Widescreen Work 2', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335251860_szynt.jpg', mediaUrl: '/uploads/img_1787335251860_szynt.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't3', title: 'Widescreen Work 3', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335265295_lkbrl.jpg', mediaUrl: '/uploads/img_1787335265295_lkbrl.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't4', title: 'Widescreen Work 4', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335277827_huaja.jpg', mediaUrl: '/uploads/img_1787335277827_huaja.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't5', title: 'Widescreen Work 5', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335292227_aqdyj.jpg', mediaUrl: '/uploads/img_1787335292227_aqdyj.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't6', title: 'Widescreen Work 6', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335301578_kbkua.jpg', mediaUrl: '/uploads/img_1787335301578_kbkua.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't7', title: 'Widescreen Work 7', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335313226_ekbud.jpg', mediaUrl: '/uploads/img_1787335313226_ekbud.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't8', title: 'Widescreen Work 8', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335327424_4ukqc.jpg', mediaUrl: '/uploads/img_1787335327424_4ukqc.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't9', title: 'Widescreen Work 9', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335385637_80rgz.jpg', mediaUrl: '/uploads/img_1787335385637_80rgz.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't10', title: 'Widescreen Work 10', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335404823_ywbus.jpg', mediaUrl: '/uploads/img_1787335404823_ywbus.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't11', title: 'Widescreen Work 11', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335417213_44yop.jpg', mediaUrl: '/uploads/img_1787335417213_44yop.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't12', title: 'Widescreen Work 12', subtitle: 'YouTube Thumbnail', img: '/uploads/img_1787335427940_6edkw.jpg', mediaUrl: '/uploads/img_1787335427940_6edkw.jpg', ratio: '16:9', category: 'Video Editing' },

  // Banners
  { id: 'b1', title: 'Ultra Wide Banner 1', subtitle: 'Header Banner', img: '/uploads/img_1787335466696_5zgbr.jpg', mediaUrl: '/uploads/img_1787335466696_5zgbr.jpg', ratio: 'Banner', category: 'Banner Design' },
  { id: 'b2', title: 'Ultra Wide Banner 2', subtitle: 'Header Banner', img: '/uploads/img_1787335477095_2pm9i.jpg', mediaUrl: '/uploads/img_1787335477095_2pm9i.jpg', ratio: 'Banner', category: 'Banner Design' },
  { id: 'b3', title: 'Ultra Wide Banner 3', subtitle: 'Header Banner', img: '/uploads/img_1787335486546_tep7i.jpg', mediaUrl: '/uploads/img_1787335486546_tep7i.jpg', ratio: 'Banner', category: 'Banner Design' },
];

let memoryPortfolio = [...DEFAULT_PORTFOLIO];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const newItem = {
        id: 'port_' + Date.now(),
        _id: 'port_' + Date.now(),
        title: data.title || 'Untitled',
        subtitle: data.subtitle || '',
        img: data.img || data.mediaUrl || '/card_own_power.png',
        mediaUrl: data.img || data.mediaUrl || '/card_own_power.png',
        category: data.category || 'Design',
        ratio: data.ratio || '4:5',
        createdAt: new Date().toISOString()
      };
      memoryPortfolio.unshift(newItem);
      return res.status(200).json({ success: true, data: memoryPortfolio });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: memoryPortfolio });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
