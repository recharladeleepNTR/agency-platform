const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  mediaUrl: { type: String, required: true },
  img: { type: String, required: true },
  ratio: { type: String, default: 'Work Preview - Slot 1 (9:16)' },
  category: { type: String, default: 'Work Preview' },
  tag: { type: String, default: 'Work Preview' },
  isExclusive: { type: Boolean, default: false },
}, { timestamps: true, _id: false });

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
