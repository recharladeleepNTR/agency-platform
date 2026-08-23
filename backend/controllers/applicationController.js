const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ClientApplication = require('../models/ClientApplication');
const { sendInquiryEmail } = require('../config/mailer');
const { getAllApplications, insertApplication, deleteApplication: deleteSqliteApp } = require('../database/sqlite');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (admin)
const getApplications = asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const apps = await ClientApplication.find({}).sort({ createdAt: -1 });
      if (apps && apps.length > 0) return res.json(apps);
    }
  } catch (err) {}

  const sqliteApps = getAllApplications();
  res.json(sqliteApps);
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
  } catch (err) {}

  if (!savedApp) {
    savedApp = insertApplication({
      _id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      role, name, email, country, serviceType, volume, budget, message, platform, contentDetails,
      createdAt: new Date().toISOString(),
    });
  } else {
    insertApplication(savedApp);
  }

  // Trigger email notification to client's email address asynchronously
  sendInquiryEmail(req.body).catch(e => console.error('Email send warning:', e.message));

  return res.status(201).json(savedApp);
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (admin)
const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  deleteSqliteApp(id);

  try {
    if (mongoose.connection.readyState === 1) {
      await ClientApplication.findByIdAndDelete(id);
    }
  } catch (err) {}

  return res.json({ success: true, id });
});

module.exports = { getApplications, createApplication, deleteApplication };
