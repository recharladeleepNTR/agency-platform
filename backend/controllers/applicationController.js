const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ClientApplication = require('../models/ClientApplication');
const { sendInquiryEmail } = require('../config/mailer');

let memoryApplications = [];

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (admin)
const getApplications = asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const apps = await ClientApplication.find({}).sort({ createdAt: -1 });
      if (apps) {
        return res.json(apps);
      }
    }
  } catch (err) {
    console.log('DB Query fallback (applications):', err.message);
  }
  res.json(memoryApplications);
});

// @desc    Create application and send email to client
// @route   POST /api/applications
// @access  Public
const createApplication = asyncHandler(async (req, res) => {
  const { role, name, email, country, serviceType, volume, budget, message, platform, contentDetails } = req.body;

  let savedApp = null;

  try {
    if (mongoose.connection.readyState === 1) {
      savedApp = await ClientApplication.create({
        role, name, email, country, serviceType, volume, budget, message, platform, contentDetails
      });
    }
  } catch (err) {
    console.log('DB Create fallback (application):', err.message);
  }

  if (!savedApp) {
    savedApp = {
      _id: 'app-' + Date.now(),
      role, name, email, country, serviceType, volume, budget, message, platform, contentDetails,
      createdAt: new Date(),
    };
  }

  memoryApplications.unshift(savedApp);

  // Trigger email notification to client's email address asynchronously
  sendInquiryEmail(req.body).catch(e => console.error('Email send warning:', e.message));

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (admin)
const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  memoryApplications = memoryApplications.filter(app => (app._id || app.id) !== id);

  try {
    if (mongoose.connection.readyState === 1) {
      await ClientApplication.findByIdAndDelete(id);
    }
  } catch (err) {
    console.log('DB Delete fallback (application):', err.message);
  }

  return res.json({ success: true, id });
});

module.exports = { getApplications, createApplication, deleteApplication };
