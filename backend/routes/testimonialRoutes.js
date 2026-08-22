const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, clearAllTestimonials } = require('../controllers/testimonialController');

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial)
  .delete(clearAllTestimonials);

router.route('/:id')
  .put(updateTestimonial)
  .delete(deleteTestimonial);

module.exports = router;
