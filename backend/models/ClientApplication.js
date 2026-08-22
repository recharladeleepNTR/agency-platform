const mongoose = require('mongoose');

const clientApplicationSchema = new mongoose.Schema({
  role: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, default: '' },
  serviceType: { type: String, default: '' },
  contentDetails: { type: String, default: '' },
  platform: { type: String, default: '' },
  volume: { type: String, default: '' },
  budget: { type: String, default: '' },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ClientApplication', clientApplicationSchema);
