import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox, FolderKanban, LogOut, Check, X,
  Trash2, Upload, Star, Plus, RefreshCw, Eye
} from 'lucide-react';
import { apiRequest, getMediaUrl, isVideoMedia } from '../api/client';
import CountryFlag from '../components/CountryFlag';

const inputCls = 'w-full bg-[#180926] border-2 border-lazyAccent/35 text-white font-medium rounded-xl px-4 py-3 text-sm outline-none focus:border-lazyAccent focus:bg-[#210d33] transition-all placeholder:text-white/40 shadow-inner';
const btnCls  = 'px-5 py-2.5 rounded-xl font-bold text-sm transition-all';

/* High-Fidelity Image & Video Processing */
const compressAndResize = (fileOrDataUrl, callback) => {
  const processSrc = (srcUrl) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 2560;
      let width = img.width;
      let height = img.height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const compressedUrl = canvas.toDataURL('image/jpeg', 0.92);
      callback(compressedUrl);
    };
    img.onerror = () => {
      callback(srcUrl);
    };
    img.src = srcUrl;
  };

  if (typeof fileOrDataUrl === 'string') {
    processSrc(fileOrDataUrl);
  } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
    const reader = new FileReader();
    reader.onload = (e) => processSrc(e.target.result);
    reader.onerror = () => callback('/card_own_power.png');
    reader.readAsDataURL(fileOrDataUrl);
  }
};

const AdminDashboard = () => {
  const [tab, setTab]                 = useState('portfolio');
  const [inquiries, setInquiries]     = useState([]);
  
  // Multi-Category Portfolio State (Fetched 100% from Backend Database)
  const [portfolioSubTab, setPortfolioSubTab] = useState('Work Preview');
  const [workPreviews, setWorkPreviews] = useState([]);
  const [posts45, setPosts45]         = useState([]);
  const [thumbnails, setThumbnails]   = useState([]);
  const [banners, setBanners]         = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [toast, setToast]               = useState('');
  const [replaceConfirmItem, setReplaceConfirmItem] = useState(null);

  // Edit / Replace Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType]       = useState('');
  
  const [editTitle, setEditTitle]     = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editImg, setEditImg]         = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editRatio, setEditRatio]     = useState('Work Preview');

  // New Item Creation Form State
  const [newTitle, setNewTitle]       = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImg, setNewImg]           = useState('');
  const [newRatio, setNewRatio]       = useState('Work Preview - Slot 1 (9:16)');
  const [newCategory, setNewCategory] = useState('Showcase');

  // Testimonial Form State
  const [tName, setTName]             = useState('');
  const [tRole, setTRole]             = useState('');
  const [tCountry, setTCountry]       = useState('USA');
  const [tRating, setTRating]         = useState(5);
  const [tText, setTText]             = useState('');

  // Manual Inquiry Form State
  const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);
  const [inqName, setInqName]         = useState('');
  const [inqEmail, setInqEmail]       = useState('');
  const [inqCountry, setInqCountry]   = useState('');
  const [inqService, setInqService]   = useState('Short-form editing');
  const [inqPlatform, setInqPlatform] = useState('YouTube');
  const [inqMessage, setInqMessage]   = useState('');

  const nav = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  /* ── 100% REBUILT FROM SCRATCH SYNCHRONOUS INQUIRIES ENGINE ── */
  const handleAddInquiry = async (e) => {
    e.preventDefault();
    if (!inqName || !inqEmail) {
      showToast('⚠️ Please enter Name & Email');
      return;
    }

    const newItem = {
      _id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: inqName,
      email: inqEmail,
      country: inqCountry || 'India',
      serviceType: 'Direct Inquiry',
      platform: 'Direct Admin Log',
      message: inqMessage || 'Logged directly from Admin Dashboard',
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    setInquiries(prev => [newItem, ...prev]);

    try {
      const stored = JSON.parse(localStorage.getItem('LAZYDITION_SYSTEM_INQUIRIES') || '[]');
      stored.unshift(newItem);
      localStorage.setItem('LAZYDITION_SYSTEM_INQUIRIES', JSON.stringify(stored));
    } catch {}

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
    } catch {}

    showToast('✅ Inquiry saved!');
    setShowAddInquiryModal(false);
    setInqName('');
    setInqEmail('');
    setInqCountry('');
    setInqMessage('');
  };

  const handleDeleteInquiry = async (id) => {
    try {
      await apiRequest('DELETE', `/applications/${id}`);
      setInquiries(prev => prev.filter(i => (i._id || i.id) !== id));
      showToast('🗑️ Inquiry deleted from MongoDB');
    } catch (e) {
      console.error('Error deleting application:', e);
      showToast('❌ Error deleting inquiry');
    }
  };

  const handleGenerateSyncLink = () => {
    try {
      const v1List = JSON.parse(localStorage.getItem('LAZYDITION_INQUIRIES_V1') || '[]');
      const legacyList = JSON.parse(localStorage.getItem('lazydition_local_inquiries') || '[]');
      const allLocal = [...v1List, ...legacyList];
      const dataToSync = allLocal.length > 0 ? allLocal : inquiries;
      if (!dataToSync || dataToSync.length === 0) {
        showToast('⚠️ No inquiries stored on this device to sync');
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(dataToSync))));
      const syncUrl = `${window.location.origin}/admin?sync_data=${encoded}`;
      navigator.clipboard.writeText(syncUrl);
      showToast('📋 1-Click Sync Link copied! Open link on laptop/phone to sync instantly!');
    } catch (e) {
      console.error(e);
      showToast('❌ Error generating sync link');
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_items_45');
      localStorage.removeItem('portfolio_items_row1');
      localStorage.removeItem('portfolio_items_banners');
      localStorage.removeItem('reviewsData');
    } catch {}

    fetchPortfolioFromDB();
    fetchTestimonialsFromDB();
  }, []);

  useEffect(() => {
    if (tab === 'inquiries') fetchInquiries();
  }, [tab]);

  /* Fetch Portfolio directly from Vercel Serverless /api/portfolio + Database API + Default Fallbacks */
  const fetchPortfolioFromDB = async () => {
    try {
      let items = [];

      // 1. Try Vercel Serverless /api/portfolio
      try {
        const sRes = await fetch('/api/portfolio');
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (sJson.data && Array.isArray(sJson.data) && sJson.data.length > 0) {
            items = sJson.data;
          }
        }
      } catch (e) {
        console.error('Serverless portfolio endpoint fetch error:', e);
      }

      // 2. Try Local/Network Database API if available
      if (items.length === 0) {
        try {
          const r = await apiRequest('GET', '/portfolio');
          if (r.data && Array.isArray(r.data) && r.data.length > 0) {
            items = r.data;
          }
        } catch (e) {
          console.error('Local DB portfolio fetch error:', e);
        }
      }

      // 3. Fallback to default portfolio items so all devices render all 26 items in 100% sync
      if (items.length === 0) {
        items = [
          // Work Previews
          { id: 'w1', title: 'Work Preview 1', subtitle: '9:16 Vertical Video', img: '/uploads/vid_1787332204764_te5no.mp4', mediaUrl: '/uploads/vid_1787332204764_te5no.mp4', ratio: 'Work Preview - Slot 1 (9:16 Vertical)', category: 'Work Preview' },
          { id: 'w2', title: 'Work Preview 2', subtitle: '16:9 Widescreen Video', img: '/uploads/vid_1787332491700_mygcu.mp4', mediaUrl: '/uploads/vid_1787332491700_mygcu.mp4', ratio: 'Work Preview - Slot 2 (16:9 Widescreen)', category: 'Work Preview' },
          { id: 'w3', title: 'Work Preview 3', subtitle: '4:5 Post Video', img: '/uploads/img_1787333909377_4uott.png', mediaUrl: '/uploads/img_1787333909377_4uott.png', ratio: 'Work Preview - Slot 3 (4:5 Post)', category: 'Work Preview' },

          // 4:5 Posters
          { id: 'p1', title: 'Work Poster 1', img: '/uploads/img_1787333949894_1jmf0.jpg', mediaUrl: '/uploads/img_1787333949894_1jmf0.jpg', ratio: '4:5', category: 'Design' },
          { id: 'p2', title: 'Work Poster 2', img: '/uploads/img_1787333959824_d5d5t.jpg', mediaUrl: '/uploads/img_1787333959824_d5d5t.jpg', ratio: '4:5', category: 'Design' },
          { id: 'p3', title: 'Work Poster 3', img: '/uploads/img_1787333971022_a6gxa.png', mediaUrl: '/uploads/img_1787333971022_a6gxa.png', ratio: '4:5', category: 'Design' },
          { id: 'p4', title: 'Work Poster 4', img: '/uploads/img_1787333981872_baixa.png', mediaUrl: '/uploads/img_1787333981872_baixa.png', ratio: '4:5', category: 'Design' },
          { id: 'p5', title: 'Work Poster 5', img: '/uploads/img_1787333992992_iyf98.jpg', mediaUrl: '/uploads/img_1787333992992_iyf98.jpg', ratio: '4:5', category: 'Design' },
          { id: 'p6', title: 'Work Poster 6', img: '/uploads/img_1787334002671_273ss.jpg', mediaUrl: '/uploads/img_1787334002671_273ss.jpg', ratio: '4:5', category: 'Design' },
          { id: 'p7', title: 'Work Poster 7', img: '/uploads/img_1787334017008_lj9un.jpg', mediaUrl: '/uploads/img_1787334017008_lj9un.jpg', ratio: '4:5', category: 'Design' },
          { id: 'p8', title: 'Work Poster 8', img: '/uploads/img_1787334033661_lxfkj.jpg', mediaUrl: '/uploads/img_1787334033661_lxfkj.jpg', ratio: '4:5', category: 'Design' },

          // 16:9 Thumbnails
          { id: 't1', title: 'Widescreen Work 1', img: '/uploads/img_1787334805662_b1tw7.jpg', mediaUrl: '/uploads/img_1787334805662_b1tw7.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't2', title: 'Widescreen Work 2', img: '/uploads/img_1787335251860_szynt.jpg', mediaUrl: '/uploads/img_1787335251860_szynt.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't3', title: 'Widescreen Work 3', img: '/uploads/img_1787335265295_lkbrl.jpg', mediaUrl: '/uploads/img_1787335265295_lkbrl.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't4', title: 'Widescreen Work 4', img: '/uploads/img_1787335277827_huaja.jpg', mediaUrl: '/uploads/img_1787335277827_huaja.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't5', title: 'Widescreen Work 5', img: '/uploads/img_1787335292227_aqdyj.jpg', mediaUrl: '/uploads/img_1787335292227_aqdyj.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't6', title: 'Widescreen Work 6', img: '/uploads/img_1787335301578_kbkua.jpg', mediaUrl: '/uploads/img_1787335301578_kbkua.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't7', title: 'Widescreen Work 7', img: '/uploads/img_1787335313226_ekbud.jpg', mediaUrl: '/uploads/img_1787335313226_ekbud.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't8', title: 'Widescreen Work 8', img: '/uploads/img_1787335327424_4ukqc.jpg', mediaUrl: '/uploads/img_1787335327424_4ukqc.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't9', title: 'Widescreen Work 9', img: '/uploads/img_1787335385637_80rgz.jpg', mediaUrl: '/uploads/img_1787335385637_80rgz.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't10', title: 'Widescreen Work 10', img: '/uploads/img_1787335404823_ywbus.jpg', mediaUrl: '/uploads/img_1787335404823_ywbus.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't11', title: 'Widescreen Work 11', img: '/uploads/img_1787335417213_44yop.jpg', mediaUrl: '/uploads/img_1787335417213_44yop.jpg', ratio: '16:9', category: 'Video Editing' },
          { id: 't12', title: 'Widescreen Work 12', img: '/uploads/img_1787335427940_6edkw.jpg', mediaUrl: '/uploads/img_1787335427940_6edkw.jpg', ratio: '16:9', category: 'Video Editing' },

          // Banners
          { id: 'b1', title: 'Ultra Wide Banner 1', img: '/uploads/img_1787335466696_5zgbr.jpg', mediaUrl: '/uploads/img_1787335466696_5zgbr.jpg', ratio: 'Banner', category: 'Banner Design' },
          { id: 'b2', title: 'Ultra Wide Banner 2', img: '/uploads/img_1787335477095_2pm9i.jpg', mediaUrl: '/uploads/img_1787335477095_2pm9i.jpg', ratio: 'Banner', category: 'Banner Design' },
          { id: 'b3', title: 'Ultra Wide Banner 3', img: '/uploads/img_1787335486546_tep7i.jpg', mediaUrl: '/uploads/img_1787335486546_tep7i.jpg', ratio: 'Banner', category: 'Banner Design' },
        ];
      }

      setWorkPreviews(items.filter(i => (i.ratio && (i.ratio.includes('Work Preview') || i.ratio.includes('Slot'))) || i.category === 'Work Preview'));
      setPosts45(items.filter(i => i.ratio === '4:5' || (!i.ratio && i.category === 'Design')));
      setThumbnails(items.filter(i => i.ratio === '16:9'));
      setBanners(items.filter(i => i.ratio === 'Banner'));
    } catch (e) {
      console.error('Error fetching portfolio from DB:', e);
    }
  };

  /* Fetch Testimonials directly from Database API */
  const fetchTestimonialsFromDB = async () => {
    try {
      const r = await apiRequest('GET', '/testimonials');
      if (r.data && Array.isArray(r.data)) {
        setTestimonials(r.data);
      }
    } catch (e) {
      console.error('Error fetching testimonials from DB:', e);
    }
  };

  /* ── STRICT FETCH INQUIRIES EXCLUSIVELY FROM MONGODB API ── */
  const fetchInquiries = async () => {
    try {
      const res = await apiRequest('GET', '/applications');
      if (res.data && Array.isArray(res.data)) {
        setInquiries(res.data);
      } else if (Array.isArray(res)) {
        setInquiries(res);
      } else {
        setInquiries([]);
      }
    } catch (e) {
      console.error('Error fetching applications from MongoDB:', e);
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        localStorage.removeItem('adminToken');
        nav('/login');
        return;
      }
      setInquiries([]);
    }
  };

  const handleSignOut = () => {
    try { localStorage.removeItem('adminToken'); } catch {}
    nav('/login');
  };

  const [newFileObj, setNewFileObj] = useState(null);

  /* Handle File Select for Browse File (Images & Videos) */
  const handleFileChange = (e, setter) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setNewFileObj(file);

    if (file.type.startsWith('video/')) {
      showToast('⏳ Video file selected from device...');
      const previewUrl = URL.createObjectURL(file);
      setter(previewUrl);
      showToast('✅ Video ready! Click "+ Upload to Database"');
      return;
    }

    compressAndResize(file, (compressedUrl) => {
      setter(compressedUrl);
    });
  };

  /* Execute replacement for an occupied slot/ratio */
  const executeReplaceOccupiedItem = async (targetId) => {
    showToast('⏳ Replacing occupied slot in Database...');
    if (newFileObj) {
      const formData = new FormData();
      formData.append('title', newTitle || 'Work Preview Item');
      formData.append('subtitle', newSubtitle || '');
      formData.append('category', newCategory || 'Design');
      formData.append('tag', newCategory || 'Design');
      formData.append('ratio', newRatio);
      formData.append('file', newFileObj);

      try {
        await apiRequest('PUT', `/portfolio/${targetId}`, formData);
        showToast('✅ Slot Replaced Successfully!');
        setNewTitle('');
        setNewSubtitle('');
        setNewImg('');
        setNewFileObj(null);
        await fetchPortfolioFromDB();
      } catch (err) {
        console.error('Replace error:', err);
        showToast(`❌ Replace failed: ${err.message}`);
      }
      return;
    }

    const finalImg = newImg || '/card_own_power.png';
    const payload = {
      title: newTitle || 'Work Preview Item',
      subtitle: newSubtitle || '',
      img: finalImg,
      mediaUrl: finalImg,
      category: newCategory || 'Design',
      tag: newCategory || 'Design',
      ratio: newRatio,
    };

    try {
      await apiRequest('PUT', `/portfolio/${targetId}`, payload);
      showToast('✅ Slot Replaced Successfully!');
      setNewTitle('');
      setNewSubtitle('');
      setNewImg('');
      await fetchPortfolioFromDB();
    } catch (err) {
      console.error(err);
      showToast(`❌ Replace failed: ${err.message}`);
    }
  };

  /* Add New Portfolio Item directly to Database API */
  const handleAddNewPortfolio = async (e, bypassCheck = false) => {
    if (e) e.preventDefault();

    // 1. Max category limits enforcement for Portfolio page
    if (newRatio === '4:5' && posts45.length >= 8) {
      showToast('❌ Limit Reached: Maximum 8 items allowed for 4:5 Posters!');
      return;
    }
    if (newRatio === '16:9' && thumbnails.length >= 12) {
      showToast('❌ Limit Reached: Maximum 12 items allowed for 16:9 Thumbnails!');
      return;
    }
    if ((newRatio === 'Banner' || newRatio === '6:1') && banners.length >= 3) {
      showToast('❌ Limit Reached: Maximum 3 items allowed for Banners!');
      return;
    }

    // 2. Replacement confirmation ONLY for Home Page Work Preview Slots (Slot 1, Slot 2, Slot 3)
    if (!bypassCheck && newRatio.includes('Work Preview')) {
      const occupiedItem = workPreviews.find(i => i.ratio && (
        (newRatio.includes('Slot 1') && i.ratio.includes('Slot 1')) ||
        (newRatio.includes('Slot 2') && i.ratio.includes('Slot 2')) ||
        (newRatio.includes('Slot 3') && i.ratio.includes('Slot 3'))
      ));

      if (occupiedItem) {
        setReplaceConfirmItem(occupiedItem);
        return;
      }
    }

    showToast('⏳ Uploading to Database...');

    if (newFileObj) {
      const formData = new FormData();
      formData.append('title', newTitle || 'Work Preview Item');
      formData.append('subtitle', newSubtitle || '');
      formData.append('category', newCategory || 'Design');
      formData.append('tag', newCategory || 'Design');
      formData.append('ratio', newRatio);
      formData.append('file', newFileObj);

      try {
        await apiRequest('POST', '/portfolio', formData);
        showToast('✅ Uploaded to Database!');
        setNewTitle('');
        setNewSubtitle('');
        setNewImg('');
        setNewFileObj(null);
        await fetchPortfolioFromDB();
      } catch (err) {
        console.error('Multipart upload error:', err);
        const errMsg = err.response?.data?.message || err.message || 'Server error';
        showToast(`❌ Upload failed: ${errMsg}`);
      }
      return;
    }

    const finalImg = newImg || '/card_own_power.png';
    const payload = {
      title: newTitle || 'Work Preview Item',
      subtitle: newSubtitle || '',
      img: finalImg,
      mediaUrl: finalImg,
      category: newCategory || 'Design',
      tag: newCategory || 'Design',
      ratio: newRatio,
    };

    try {
      await apiRequest('POST', '/portfolio', payload);
      showToast('✅ Uploaded to Database!');
      setNewTitle('');
      setNewSubtitle('');
      setNewImg('');
      await fetchPortfolioFromDB();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Server error';
      showToast(`❌ Upload failed: ${errMsg}`);
    }
  };

  /* Handle Instant Device Photo/Video Select for card replace */
  const handlePhotoSelect = async (e, item) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const targetId = item._id || item.id || item.title;

    if (file.type.startsWith('video/')) {
      showToast('⏳ Uploading video to Database...');
      const formData = new FormData();
      formData.append('title', item.title || 'Work Preview Item');
      formData.append('subtitle', item.subtitle || '');
      formData.append('category', item.category || 'Design');
      formData.append('tag', item.category || 'Design');
      formData.append('ratio', item.ratio || 'Work Preview - Slot 1 (1920x1080)');
      formData.append('file', file);

      try {
        await apiRequest('PUT', `/portfolio/${targetId}`, formData);
        showToast('✅ Video saved to Database!');
        await fetchPortfolioFromDB();
      } catch (err) {
        console.error('Failed to save video:', err);
        const errMsg = err.response?.data?.message || err.message || 'Server error';
        showToast(`❌ Video save failed: ${errMsg}`);
      }
      return;
    }

    compressAndResize(file, async (compressedUrl) => {
      const updatedPayload = {
        title: item.title,
        subtitle: item.subtitle,
        category: item.category || 'Design',
        ratio: item.ratio || 'Work Preview - Slot 1 (1920x1080)',
        img: compressedUrl,
        mediaUrl: compressedUrl,
      };

      try {
        await apiRequest('PUT', `/portfolio/${targetId}`, updatedPayload);
        showToast('✅ Photo saved to Database!');
        await fetchPortfolioFromDB();
      } catch (err) {
        console.error('Failed to save photo to DB:', err);
      }
    });
  };

  /* Open Edit / Replace Modal */
  const openReplaceModal = (item, type = 'portfolio') => {
    setEditingItem(item);
    setEditType(type);
    setEditTitle(item.title || item.name || '');
    setEditSubtitle(item.subtitle || item.role || item.text || '');
    setEditImg(item.img || item.mediaUrl || '');
    setEditCategory(item.category || item.tag || '');
    setEditRatio(item.ratio || 'Work Preview');
  };

  /* Save Replace / Edit directly to Database API */
  const handleSaveReplace = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingItem) return;

    const targetId = editingItem._id || editingItem.id || editingItem.title;
    const rawTargetImg = editImg || editingItem.img || editingItem.mediaUrl || '/card_own_power.png';

    const commitToDB = async (finalImg) => {
      if (editType === 'portfolio') {
        const payload = {
          title: editTitle || editingItem.title || 'Portfolio Item',
          subtitle: editSubtitle || editingItem.subtitle || '',
          img: finalImg,
          mediaUrl: finalImg,
          category: editCategory || editingItem.category || 'Design',
          tag: editCategory || editingItem.category || 'Design',
          ratio: editRatio,
        };

        try {
          await apiRequest('PUT', `/portfolio/${targetId}`, payload);
          showToast('✅ Saved to Database!');
          await fetchPortfolioFromDB();
        } catch (err) {
          console.error(err);
          const errMsg = err.response?.data?.message || err.message || 'Server error';
          showToast(`❌ DB Update Failed: ${errMsg}`);
        }
      } else if (editType === 'testimonial') {
        const payloadT = {
          name: editTitle,
          role: editCategory || 'Creator',
          text: editSubtitle,
        };

        try {
          await apiRequest('PUT', `/testimonials/${targetId}`, payloadT);
          showToast('✅ Testimonial updated in Database!');
          await fetchTestimonialsFromDB();
        } catch (err) {
          console.error(err);
        }
      }
      setEditingItem(null);
    };

    if (rawTargetImg.startsWith('data:video') || isVideoMedia(rawTargetImg)) {
      commitToDB(rawTargetImg);
    } else {
      compressAndResize(rawTargetImg, (compressedImg) => {
        commitToDB(compressedImg);
      });
    }
  };

  /* Delete Item directly from Database API */
  const handleDeleteItem = async (item, type = 'portfolio') => {
    const targetId = item._id || item.id || item.title;
    if (!window.confirm(`Permanently delete "${item.title || item.name || 'item'}" from Database?`)) return;

    try {
      if (type === 'portfolio') {
        await apiRequest('DELETE', `/portfolio/${targetId}`);
        showToast('🗑️ Deleted from Database!');
        await fetchPortfolioFromDB();
      } else if (type === 'testimonial') {
        await apiRequest('DELETE', `/testimonials/${targetId}`);
        showToast('🗑️ Testimonial deleted!');
        await fetchTestimonialsFromDB();
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Deletion failed');
    }
  };



  /* Add Testimonial directly to Database API */
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!tName || !tText) {
      showToast('⚠️ Please enter client name and review text');
      return;
    }

    try {
      await apiRequest('POST', '/testimonials', {
        name: tName,
        role: tRole || 'Creator',
        country: tCountry,
        rating: Number(tRating),
        text: tText,
        flag: '🇺🇸',
      });
      showToast('✅ Testimonial saved to Database!');
      setTName('');
      setTRole('');
      setTText('');
      await fetchTestimonialsFromDB();
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: 'inquiries',    label: 'Inquiries', icon: <Inbox className="w-4 h-4" /> },
    { key: 'portfolio',    label: 'Portfolio Media', icon: <FolderKanban className="w-4 h-4" /> },
    { key: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#07000e] text-lazyText pt-24 pb-16 px-4 md:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-8 z-50 px-6 py-3 rounded-xl bg-lazyAccent text-white font-black text-sm shadow-[0_0_30px_rgba(148,148,255,0.6)] animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-2 flex-shrink-0">
          <div className="p-5 rounded-2xl bg-[#140622] border-2 border-lazyAccent/30 mb-4">
            <h2 className="text-xl font-black text-white tracking-tight">Admin Dashboard</h2>
            <p className="text-xs text-lazyAccent font-bold mt-1">Live Database Storage Active</p>
          </div>

          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-extrabold transition-all border ${
                tab === t.key
                  ? 'bg-gradient-to-r from-lazyAccent to-lazyDeep border-lazyAccent text-white shadow-[0_0_20px_rgba(148,148,255,0.3)]'
                  : 'bg-[#140622] border-white/10 text-white/70 hover:border-lazyAccent/40 hover:text-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all mt-6"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[#140622] border-2 border-lazyAccent/30 rounded-3xl p-6 md:p-8 shadow-xl">
          
          {/* ── INQUIRIES TAB ── */}
          {tab === 'inquiries' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Client Applications ({inquiries.length})</h3>
                  <p className="text-xs text-lazyAccent font-bold">All form submissions & email inquiries synced live</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateSyncLink}
                    title="Generate 1-Click Link to sync phone inquiries to laptop"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#180926] border border-lazyAccent/40 hover:bg-lazyAccent/20 text-lazyAccent transition-all shadow-sm"
                  >
                    <span>📱 Copy 1-Click Sync Link</span>
                  </button>
                  <button
                    onClick={fetchInquiries}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#180926] border border-white/15 hover:border-lazyAccent text-white transition-all shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setShowAddInquiryModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-lazyAccent hover:bg-lazyAccent/80 text-white transition-all shadow-[0_0_15px_rgba(148,148,255,0.4)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Inquiry</span>
                  </button>
                </div>
              </div>

              {/* Add Manual Inquiry Modal */}
              {showAddInquiryModal && (
                <div className="mb-8 p-6 rounded-2xl bg-[#180926] border-2 border-lazyAccent/50 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="text-base font-black text-white">Log / Add New Client Inquiry</h4>
                    <button onClick={() => setShowAddInquiryModal(false)} className="text-white/50 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddManualInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-lazyAccent block mb-1">Client Name *</label>
                        <input
                          type="text"
                          required
                          value={inqName}
                          onChange={e => setInqName(e.target.value)}
                          className={inputCls}
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-lazyAccent block mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={inqEmail}
                          onChange={e => setInqEmail(e.target.value)}
                          className={inputCls}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-lazyAccent block mb-1">Country</label>
                        <input
                          type="text"
                          value={inqCountry}
                          onChange={e => setInqCountry(e.target.value)}
                          className={inputCls}
                          placeholder="United States"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-lazyAccent block mb-1">Service</label>
                        <select
                          value={inqService}
                          onChange={e => setInqService(e.target.value)}
                          className={inputCls}
                        >
                          <option value="Long-form editing">Long-form editing</option>
                          <option value="Short-form editing">Short-form editing</option>
                          <option value="Visual Design">Visual Design</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-lazyAccent block mb-1">Platform</label>
                        <select
                          value={inqPlatform}
                          onChange={e => setInqPlatform(e.target.value)}
                          className={inputCls}
                        >
                          <option value="YouTube">YouTube</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="Subscription based platform">Subscription based platform</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-lazyAccent block mb-1">Client Message / Notes</label>
                      <textarea
                        rows={3}
                        value={inqMessage}
                        onChange={e => setInqMessage(e.target.value)}
                        className={inputCls}
                        placeholder="Type or paste client inquiry notes..."
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddInquiryModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl text-xs font-black bg-lazyAccent hover:bg-lazyAccent/80 text-white shadow-lg"
                      >
                        Save Inquiry
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#180926] border border-white/10">
                  <Inbox className="w-10 h-10 text-lazyAccent/40 mx-auto mb-3" />
                  <p className="text-white/60 font-bold">No new client inquiries submitted yet.</p>
                  <p className="text-xs text-white/40 mt-1">Applications submitted on the Contact page will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((app) => (
                    <div key={app._id || app.id} className="p-6 rounded-2xl bg-[#180926] border border-white/10 space-y-3 group/card">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-lg font-black text-white">{app.name}</span>
                          <span className="text-xs font-bold text-lazyAccent bg-lazyAccent/10 px-2.5 py-0.5 rounded-full ml-3 border border-lazyAccent/30">
                            {app.role || 'Creator'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/50 font-mono">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <button
                            onClick={() => handleDeleteInquiry(app._id || app.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-white/80 font-medium">
                        <div><strong className="text-lazyAccent">Email:</strong> {app.email}</div>
                        <div className="flex items-center gap-1.5"><strong className="text-lazyAccent">Country:</strong> <CountryFlag country={app.country} className="w-4 h-3 rounded-xs object-cover flex-shrink-0" /> <span>{app.country || 'N/A'}</span></div>
                        <div><strong className="text-lazyAccent">Service:</strong> {app.serviceType || 'N/A'}</div>
                        <div><strong className="text-lazyAccent">Platform:</strong> {app.platform || 'N/A'}</div>
                        <div><strong className="text-lazyAccent">Volume:</strong> {app.volume || 'N/A'}</div>
                        <div><strong className="text-lazyAccent">Budget:</strong> {app.budget || 'N/A'}</div>
                      </div>

                      {app.message && (
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-white/90 italic">
                          "{app.message}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PORTFOLIO MEDIA TAB ── */}
          {tab === 'portfolio' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Portfolio & Work Preview Media</h3>
                  <p className="text-xs text-lazyAccent font-bold">Manage media items directly in Database</p>
                </div>

                {/* Ratio Sub-Tabs */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#180926] border border-white/10">
                  <button
                    onClick={() => setPortfolioSubTab('Work Preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      portfolioSubTab === 'Work Preview'
                        ? 'bg-lazyAccent text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Work Preview ({workPreviews.length})
                  </button>
                  <button
                    onClick={() => setPortfolioSubTab('4:5')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      portfolioSubTab === '4:5'
                        ? 'bg-lazyAccent text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    4:5 Posters ({posts45.length})
                  </button>
                  <button
                    onClick={() => setPortfolioSubTab('16:9')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      portfolioSubTab === '16:9'
                        ? 'bg-lazyAccent text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    16:9 Thumbnails ({thumbnails.length})
                  </button>
                  <button
                    onClick={() => setPortfolioSubTab('Banner')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      portfolioSubTab === 'Banner'
                        ? 'bg-lazyAccent text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Banners ({banners.length})
                  </button>
                </div>
              </div>

              {/* Add New Portfolio Item Form */}
              <form onSubmit={handleAddNewPortfolio} className="p-6 rounded-2xl bg-[#180926] border border-white/10 mb-8 space-y-4">
                <h4 className="text-sm font-extrabold text-lazyAccent uppercase tracking-wider">Add Image or Video to Database</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Title</label>
                    <input
                      type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. WORK PREVIEW ITEM" className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Subtitle</label>
                    <input
                      type="text" value={newSubtitle} onChange={e => setNewSubtitle(e.target.value)}
                      placeholder="e.g. High Impact Video" className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Category / Ratio Type</label>
                    <select value={newRatio} onChange={e => setNewRatio(e.target.value)} className={inputCls}>
                      <optgroup label="Home Page Work Preview Slots (Independent)">
                        <option value="Work Preview - Slot 1 (9:16)" className="bg-[#180926]">Work Preview - Slot 1 (9:16 Vertical 1080×1920)</option>
                        <option value="Work Preview - Slot 2 (16:9)" className="bg-[#180926]">Work Preview - Slot 2 (16:9 Widescreen [Private])</option>
                        <option value="Work Preview - Slot 3 (4:5)" className="bg-[#180926]">Work Preview - Slot 3 (4:5 Social Post 1080×1350)</option>
                      </optgroup>
                      <optgroup label="Portfolio Page Media Showcase">
                        <option value="4:5" className="bg-[#180926]">4:5 Social Posters (Max 8 Items)</option>
                        <option value="16:9" className="bg-[#180926]">16:9 Widescreen Thumbnails (Max 12 Items - 2 Rows of 6)</option>
                        <option value="Banner" className="bg-[#180926]">6:1 Ultra-Wide Banners (Max 3 Items)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Option A: Browse Image or Video File (.mp4, .png, .jpg)</label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lazyAccent/15 border-2 border-dashed border-lazyAccent/40 hover:border-lazyAccent hover:bg-lazyAccent/25 transition-all text-white text-xs font-extrabold shadow-inner group">
                      <Upload className="w-4 h-4 text-lazyAccent group-hover:scale-110 transition-transform" />
                      <span>{newImg ? (isVideoMedia(newImg) ? '✅ Video File Selected' : '✅ Image File Selected') : 'Browse Image or Video from Device...'}</span>
                      <input
                        type="file" accept="image/*,video/*" className="hidden"
                        onChange={(e) => handleFileChange(e, setNewImg)}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Option B: Image / Video URL</label>
                    <input
                      type="text" value={newImg} onChange={e => setNewImg(e.target.value)}
                      placeholder="/uploads/video.mp4 or URL" className={inputCls}
                    />
                  </div>
                </div>

                {newImg && (
                  <div className="relative aspect-video max-w-xs rounded-xl overflow-hidden bg-black border border-lazyAccent/30" onContextMenu={(e) => e.preventDefault()}>
                    <div className="absolute inset-0 z-20 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                    {isVideoMedia(newImg) ? (
                      <video
                        autoPlay loop muted playsInline
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                        disableRemotePlayback
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover pointer-events-none"
                      >
                        <source src={newImg} type="video/mp4" />
                        <source src={newImg} type="video/webm" />
                      </video>
                    ) : (
                      <img src={newImg} alt="Preview" onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover pointer-events-none" />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 z-30 text-[9px] font-black text-white bg-black/80 px-2 py-0.5 rounded border border-white/20">
                      Selected Media Preview
                    </span>
                  </div>
                )}

                <button type="submit" className={`${btnCls} bg-gradient-to-r from-lazyAccent to-lazyDeep text-white shadow-[0_0_20px_rgba(148,148,255,0.4)]`}>
                  + Upload to Database
                </button>
              </form>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(portfolioSubTab === 'Work Preview' ? workPreviews : portfolioSubTab === '16:9' ? thumbnails : portfolioSubTab === 'Banner' ? banners : posts45).map((item, idx) => {
                  const mediaSrc = getMediaUrl(item.img || item.mediaUrl);
                  const itemKey = item._id || item.id || `item-${idx}`;

                  return (
                    <div key={itemKey} className="p-4 rounded-2xl bg-[#180926] border border-white/10 space-y-3 relative group" onContextMenu={(e) => e.preventDefault()}>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10" onContextMenu={(e) => e.preventDefault()}>
                        <div className="absolute inset-0 z-10 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                        {isVideoMedia(mediaSrc) ? (
                          <video
                            autoPlay loop muted playsInline
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                            disableRemotePlayback
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover pointer-events-none"
                          >
                            <source src={mediaSrc} type="video/mp4" />
                            <source src={mediaSrc} type="video/webm" />
                          </video>
                        ) : (
                          <img src={mediaSrc} alt={item.title} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover pointer-events-none" />
                        )}

                        {/* Fast Device Replace Button */}
                        <label className="absolute bottom-2 right-2 z-10 cursor-pointer p-2 rounded-lg bg-black/80 hover:bg-lazyAccent text-white transition-all shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handlePhotoSelect(e, item)} />
                        </label>
                      </div>

                      <div>
                        <h5 className="font-black text-white text-sm truncate">{item.title || 'Portfolio Item'}</h5>
                        <p className="text-xs text-white/50 truncate font-medium">{item.subtitle || item.category || 'Design'}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => openReplaceModal(item, 'portfolio')}
                          className="flex-1 py-1.5 rounded-lg bg-lazyAccent/20 hover:bg-lazyAccent border border-lazyAccent/40 text-white font-extrabold text-xs transition-all"
                        >
                          Edit / Replace
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item, 'portfolio')}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS TAB ── */}
          {tab === 'testimonials' && (
            <div>
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Client Testimonials ({testimonials.length})</h3>

              {/* Add New Testimonial Form */}
              <form onSubmit={handleAddTestimonial} className="p-6 rounded-2xl bg-[#180926] border border-white/10 mb-8 space-y-4">
                <h4 className="text-sm font-extrabold text-lazyAccent uppercase tracking-wider">Add Client Testimonial</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Client Name</label>
                    <input type="text" value={tName} onChange={e => setTName(e.target.value)} placeholder="e.g. Alex M." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Role</label>
                    <input type="text" value={tRole} onChange={e => setTRole(e.target.value)} placeholder="e.g. YouTube Creator" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Country</label>
                    <input type="text" value={tCountry} onChange={e => setTCountry(e.target.value)} placeholder="e.g. USA" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Rating</label>
                    <input type="number" step="0.1" min="1" max="5" value={tRating} onChange={e => setTRating(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">Review Text</label>
                  <textarea rows={3} value={tText} onChange={e => setTText(e.target.value)} placeholder="Write review..." className={`${inputCls} resize-none`} />
                </div>

                <button type="submit" className={`${btnCls} bg-gradient-to-r from-lazyAccent to-lazyDeep text-white shadow-[0_0_20px_rgba(148,148,255,0.4)]`}>
                  + Save Testimonial to DB
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map((t, idx) => (
                  <div key={t._id || t.id || idx} className="p-5 rounded-2xl bg-[#180926] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm">{t.name}</span>
                      <span className="text-xs font-bold text-lazyAccent">{t.role}</span>
                    </div>
                    <p className="text-xs text-white/70 italic">"{t.text}"</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <button onClick={() => openReplaceModal(t, 'testimonial')} className="text-xs font-extrabold text-lazyAccent hover:underline">
                        Edit Review
                      </button>
                      <button onClick={() => handleDeleteItem(t, 'testimonial')} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Edit / Replace Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140622] border-2 border-lazyAccent/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-[#140622] p-6 border-b border-white/10 flex items-center justify-between z-20">
              <h3 className="text-lg font-black text-white">Edit / Replace Database Item</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReplace} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Title / Name</label>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Subtitle / Text</label>
                <textarea rows={3} value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} className={`${inputCls} resize-none`} />
              </div>

              {editType === 'portfolio' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">1. Browse New Image or Video File</label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lazyAccent/15 border-2 border-dashed border-lazyAccent/40 hover:border-lazyAccent text-white text-xs font-extrabold shadow-inner">
                      <Upload className="w-4 h-4 text-lazyAccent" />
                      <span>{editImg ? (isVideoMedia(editImg) ? '✅ Video Selected' : '✅ Image Selected') : 'Select Image or Video from Device...'}</span>
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFileChange(e, setEditImg)} />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">2. Or Media File Path / URL</label>
                    <input type="text" value={editImg} onChange={e => setEditImg(e.target.value)} className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Category Tag</label>
                      <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Aspect Ratio</label>
                      <select value={editRatio} onChange={e => setEditRatio(e.target.value)} className={inputCls}>
                        <option value="Work Preview - Slot 1 (9:16)" className="bg-[#180926]">Work Preview - Slot 1 (9:16 Vertical 1080×1920)</option>
                        <option value="Work Preview - Slot 2 (16:9)" className="bg-[#180926]">Work Preview - Slot 2 (16:9 Widescreen 1920×1080 [Private])</option>
                        <option value="Work Preview - Slot 3 (4:5)" className="bg-[#180926]">Work Preview - Slot 3 (4:5 Social Post 1080×1350)</option>
                        <option value="4:5" className="bg-[#180926]">4:5 Vertical</option>
                        <option value="16:9" className="bg-[#180926]">16:9 Widescreen</option>
                        <option value="Banner" className="bg-[#180926]">Banner</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button type="submit" className={`flex-1 ${btnCls} bg-gradient-to-r from-lazyAccent to-lazyDeep text-white shadow-md`}>
                  Save Changes to DB
                </button>
                <button type="button" onClick={() => setEditingItem(null)} className={`${btnCls} bg-white/10 text-white hover:bg-white/20`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Replacement Confirmation Modal */}
      {replaceConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#180926] border-2 border-lazyAccent/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-xl font-black text-white">Slot / Ratio Already Occupied</h3>
            <p className="text-lazyText/70 text-xs leading-relaxed">
              An item (<span className="text-white font-bold">"{replaceConfirmItem.title || replaceConfirmItem._id}"</span>) is already assigned to <span className="text-lazyAccent font-bold">"{newRatio}"</span>.
              <br/><br/>
              Do you want to replace the existing item or cancel to change your Category / Ratio selection?
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  const targetId = replaceConfirmItem._id;
                  setReplaceConfirmItem(null);
                  executeReplaceOccupiedItem(targetId);
                }}
                className={`${btnCls} bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-lg hover:brightness-110`}
              >
                Yes, Replace Existing Item
              </button>
              <button
                onClick={() => setReplaceConfirmItem(null)}
                className={`${btnCls} bg-white/10 text-white hover:bg-white/20`}
              >
                Cancel (Change Ratio Type)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
