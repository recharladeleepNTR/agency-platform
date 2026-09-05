const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const PortfolioItem = require('../models/PortfolioItem');

// Helper to save base64 image & video strings
const saveBase64ToFile = (base64Str) => {
  if (!base64Str || typeof base64Str !== 'string') return '/card_own_power.png';
  if (base64Str.startsWith('blob:')) return '/card_own_power.png';
  if (!base64Str.startsWith('data:')) {
    return base64Str;
  }
  // Store compressed image Base64 dataURL strings directly in MongoDB Atlas for 100% zero-cost permanent persistence across Render container restarts!
  if (base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  try {
    const matches = base64Str.match(/^data:(image|video)\/([^;]+);base64,(.+)$/);
    if (!matches || matches.length !== 4) return base64Str;

    const mediaType = matches[1];
    let rawSubtype = matches[2].toLowerCase();

    let ext = 'mp4';
    if (mediaType === 'image') {
      ext = rawSubtype === 'jpeg' ? 'jpg' : rawSubtype.replace(/[^a-z0-9]/g, '');
    } else {
      if (rawSubtype.includes('quicktime') || rawSubtype.includes('mov')) ext = 'mov';
      else if (rawSubtype.includes('webm')) ext = 'webm';
      else ext = 'mp4';
    }

    const dataBuffer = Buffer.from(matches[3], 'base64');
    const prefix = mediaType === 'video' ? 'vid' : 'img';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, dataBuffer);
    console.log(`✅ Saved ${mediaType} file (${(dataBuffer.length / 1024 / 1024).toFixed(2)} MB) to /uploads/${filename}`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 to file:', err.message);
    return base64Str;
  }
};

// @desc    Get all portfolio items from MongoDB
// @route   GET /api/portfolio
// @access  Public
const getPortfolioItems = asyncHandler(async (req, res) => {
  const items = await PortfolioItem.find({}).sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Create new portfolio item in MongoDB
// @route   POST /api/portfolio
// @access  Public / Private
const uploadPortfolioItem = asyncHandler(async (req, res) => {
  const { title, subtitle, ratio, category, tag, isExclusive, img, mediaUrl } = req.body;
  
  let mediaPath = null;
  if (req.file) {
    mediaPath = `/uploads/${req.file.filename}`;
  } else if (img || mediaUrl) {
    mediaPath = saveBase64ToFile(img || mediaUrl);
  } else {
    mediaPath = '/card_own_power.png';
  }

  const itemId = 'p-' + Date.now();
  const newItem = await PortfolioItem.create({
    _id: itemId,
    id: itemId,
    title: title || 'Work Preview Item',
    subtitle: subtitle || '',
    ratio: ratio || 'Work Preview - Slot 1 (9:16)',
    category: category || 'Work Preview',
    tag: tag || category || 'Work Preview',
    isExclusive: isExclusive === 'true' || isExclusive === true,
    img: mediaPath,
    mediaUrl: mediaPath,
  });

  res.status(201).json(newItem);
});

// @desc    Update existing portfolio item in MongoDB
// @route   PUT /api/portfolio/:id
// @access  Public / Private
const updatePortfolioItem = asyncHandler(async (req, res) => {
  const { title, subtitle, ratio, category, tag, isExclusive, img, mediaUrl } = req.body;
  const targetId = req.params.id;

  let mediaPath = null;
  if (req.file) {
    mediaPath = `/uploads/${req.file.filename}`;
  } else if (img || mediaUrl) {
    mediaPath = saveBase64ToFile(img || mediaUrl);
  }

  // Find exact item by _id or id
  const existingItem = await PortfolioItem.findOne({ $or: [{ _id: targetId }, { id: targetId }] });

  if (!existingItem) {
    res.status(404);
    throw new Error(`Portfolio item with ID "${targetId}" not found in database.`);
  }

  if (title) existingItem.title = title;
  if (subtitle !== undefined) existingItem.subtitle = subtitle;
  if (ratio) existingItem.ratio = ratio;
  if (category) existingItem.category = category;
  if (tag) existingItem.tag = tag;
  if (isExclusive !== undefined) existingItem.isExclusive = (isExclusive === 'true' || isExclusive === true);

  if (mediaPath) {
    existingItem.img = mediaPath;
    existingItem.mediaUrl = mediaPath;
  }

  const updatedItem = await existingItem.save();
  res.json(updatedItem);
});

// @desc    Delete portfolio item from MongoDB
// @route   DELETE /api/portfolio/:id
// @access  Public / Private
const deletePortfolioItem = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  await PortfolioItem.deleteOne({ $or: [{ _id: targetId }, { id: targetId }] });
  res.json({ message: 'Portfolio item removed from MongoDB', id: targetId });
});

// @desc    Clear all portfolio items from MongoDB
// @route   DELETE /api/portfolio
// @access  Public / Private
const clearAllPortfolioItems = asyncHandler(async (req, res) => {
  await PortfolioItem.deleteMany({});
  res.json({ message: 'Portfolio items cleared from MongoDB' });
});

module.exports = {
  getPortfolioItems,
  uploadPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  clearAllPortfolioItems,
};
