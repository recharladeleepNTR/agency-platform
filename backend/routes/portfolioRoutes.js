const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getPortfolioItems,
  uploadPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  clearAllPortfolioItems,
} = require('../controllers/portfolioController');

// Configure disk storage for Multer uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const prefix = file.mimetype.startsWith('video') ? 'vid' : 'img';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2000 * 1024 * 1024 }, // 2000 MB (2 GB) limit
});

const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer file upload error:', err.message);
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    }
    next();
  });
};

router.route('/')
  .get(getPortfolioItems)
  .post(uploadMiddleware, uploadPortfolioItem)
  .delete(clearAllPortfolioItems);

router.route('/:id')
  .put(uploadMiddleware, updatePortfolioItem)
  .delete(deletePortfolioItem);

module.exports = router;
