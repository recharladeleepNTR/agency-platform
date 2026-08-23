const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas (Single Source of Truth)
connectDB();

// Permissive CORS middleware allowing Vercel and all external origins
app.use(cors());

// High payload limits for base64 uploading videos and high-res images (1000MB)
app.use(express.json({ limit: '1000mb', parameterLimit: 1000000 }));
app.use(express.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 1000000 }));

// High-performance video range streaming middleware
app.get('/uploads/:filename', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return next();

  const ext = path.extname(req.params.filename).toLowerCase();
  if (['.mp4', '.webm', '.mov', '.m4v'].includes(ext)) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.m4v': 'video/mp4',
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      res.writeHead(206, head);
      return file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      return fs.createReadStream(filePath).pipe(res);
    }
  }
  next();
});

// Serve local uploads statically fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));

app.get('/', (req, res) => {
  res.send('Agency Platform API is running on port 5001 (MongoDB Atlas Active)...');
});

// Custom Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server listening on port 5001 (0.0.0.0 dual-stack)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Agency Platform Backend Server running on port ${PORT} (MongoDB Atlas Active)`);
});
