const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials from MongoDB
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.json(testimonials || []);
});

// @desc    Create new testimonial in MongoDB
// @route   POST /api/testimonials
// @access  Private (admin)
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, country, rating, text } = req.body;

  const testimonial = await Testimonial.create({
    name: name || 'Verified Creator',
    role: role || '',
    country: country || '',
    rating: rating || 5,
    text: text || 'Great service!',
  });

  return res.status(201).json(testimonial);
});

// @desc    Update existing testimonial in MongoDB
// @route   PUT /api/testimonials/:id
// @access  Private (admin)
const updateTestimonial = asyncHandler(async (req, res) => {
  const { name, role, country, rating, text } = req.body;
  const targetId = req.params.id;

  const testimonial = await Testimonial.findById(targetId);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found in MongoDB');
  }

  testimonial.name = name || testimonial.name;
  testimonial.role = role !== undefined ? role : testimonial.role;
  testimonial.country = country !== undefined ? country : testimonial.country;
  testimonial.rating = rating || testimonial.rating;
  testimonial.text = text || testimonial.text;

  const updated = await testimonial.save();
  res.json(updated);
});

// @desc    Delete testimonial from MongoDB
// @route   DELETE /api/testimonials/:id
// @access  Private (admin)
const deleteTestimonial = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  await Testimonial.findByIdAndDelete(targetId);
  res.json({ message: 'Testimonial removed from MongoDB', id: targetId });
});

// @desc    Clear all testimonials completely from MongoDB
// @route   DELETE /api/testimonials
// @access  Private (admin)
const clearAllTestimonials = asyncHandler(async (req, res) => {
  await Testimonial.deleteMany({});
  res.json({ message: 'All testimonials cleared from MongoDB' });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, clearAllTestimonials };
