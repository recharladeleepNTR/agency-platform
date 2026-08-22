const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');

let memoryTestimonials = [];

const isSameItem = (a, bTarget) => {
  if (!a || !bTarget) return false;
  const idA = String(a._id || a.id || a.name || '').trim().toLowerCase();
  const idB = typeof bTarget === 'object'
    ? String(bTarget._id || bTarget.id || bTarget.name || '').trim().toLowerCase()
    : String(bTarget).trim().toLowerCase();
  return idA !== '' && idA === idB;
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
      return res.json(testimonials || []);
    }
  } catch (err) {
    console.log('DB Query fallback (testimonials):', err.message);
  }
  res.json(memoryTestimonials);
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (admin)
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, country, rating, text } = req.body;

  const newReview = {
    _id: 't-' + Date.now(),
    name: name || 'Verified Creator',
    role: role || '',
    country: country || '',
    rating: rating || 5,
    text: text || 'Great service!',
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const testimonial = await Testimonial.create({
        name: newReview.name,
        role: newReview.role,
        country: newReview.country,
        rating: newReview.rating,
        text: newReview.text,
      });
      memoryTestimonials = [testimonial, ...memoryTestimonials.filter(t => !isSameItem(t, testimonial._id))];
      return res.status(201).json(testimonial);
    }
  } catch (err) {
    console.log('DB Create fallback (testimonial):', err.message);
  }

  memoryTestimonials = [newReview, ...memoryTestimonials.filter(t => !isSameItem(t, newReview._id))];
  return res.status(201).json(newReview);
});

// @desc    Update existing testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (admin)
const updateTestimonial = asyncHandler(async (req, res) => {
  const { name, role, country, rating, text } = req.body;
  const targetId = req.params.id;

  const updatedPayload = {
    _id: targetId,
    name, role, country, rating, text
  };

  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(targetId)) {
      const testimonial = await Testimonial.findById(targetId);
      if (testimonial) {
        testimonial.name = name || testimonial.name;
        testimonial.role = role !== undefined ? role : testimonial.role;
        testimonial.country = country !== undefined ? country : testimonial.country;
        testimonial.rating = rating || testimonial.rating;
        testimonial.text = text || testimonial.text;
        const updated = await testimonial.save();
        
        const idx = memoryTestimonials.findIndex(t => isSameItem(t, targetId));
        if (idx !== -1) memoryTestimonials[idx] = updated;
        return res.json(updated);
      }
    }
  } catch (err) {
    console.log('DB Update fallback (testimonial):', err.message);
  }

  const idx = memoryTestimonials.findIndex(t => isSameItem(t, targetId));
  if (idx !== -1) {
    memoryTestimonials[idx] = { ...memoryTestimonials[idx], ...updatedPayload };
  }

  res.json(updatedPayload);
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (admin)
const deleteTestimonial = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(targetId)) {
      const testimonial = await Testimonial.findById(targetId);
      if (testimonial) {
        await testimonial.deleteOne();
      }
    }
  } catch (err) {
    console.log('DB Delete fallback (testimonial):', err.message);
  }

  memoryTestimonials = memoryTestimonials.filter(t => !isSameItem(t, targetId));
  res.json({ message: 'Testimonial removed', id: targetId });
});

// @desc    Clear all testimonials completely
// @route   DELETE /api/testimonials
// @access  Private (admin)
const clearAllTestimonials = asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Testimonial.deleteMany({});
    }
  } catch (err) {
    console.log('DB Purge Error:', err.message);
  }
  memoryTestimonials = [];
  res.json({ message: 'All testimonials cleared' });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, clearAllTestimonials };
