const mongoose = require('mongoose');
require('dotenv').config();

const PortfolioItem = require('./models/PortfolioItem');
const Testimonial = require('./models/Testimonial');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agency_platform';

async function purge() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB. Purging all collections...');
    
    await PortfolioItem.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('✅ ALL PORTFOLIO ITEMS & TESTIMONIALS DELETED FROM MONGODB!');
  } catch (err) {
    console.log('Cloud MongoDB purge offline, retrying with local MongoDB...');
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/agency_platform', { serverSelectionTimeoutMS: 2000 });
      await PortfolioItem.deleteMany({});
      await Testimonial.deleteMany({});
      console.log('✅ ALL PORTFOLIO ITEMS & TESTIMONIALS DELETED FROM LOCAL MONGODB!');
    } catch (lErr) {
      console.log('Local MongoDB not running or empty:', lErr.message);
    }
  } finally {
    process.exit(0);
  }
}

purge();
