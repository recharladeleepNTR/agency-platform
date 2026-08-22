const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Verified Creator',
    trim: true,
  },
  role: {
    type: String,
    default: '',
    trim: true,
  },
  country: {
    type: String,
    default: '',
    trim: true,
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
