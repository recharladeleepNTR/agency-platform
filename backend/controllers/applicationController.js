const asyncHandler = require('express-async-handler');
const ClientApplication = require('../models/ClientApplication');
const { sendInquiryEmail } = require('../config/mailer');

// @desc    Get all applications directly from MongoDB (Single Source of Truth)
// @route   GET /api/applications
// @access  Private (admin)
const getApplications = asyncHandler(async (req, res) => {
  const apps = await ClientApplication.find({}).sort({ createdAt: -1 });
  res.json(apps);
});

// @desc    Create application in MongoDB and send email
// @route   POST /api/applications
// @access  Public
const createApplication = asyncHandler(async (req, res) => {
  const { role, name, email, country, serviceType, volume, budget, message, platform, contentDetails } = req.body;

  // 1. Save document to MongoDB Atlas (Single Source of Truth)
  const savedApp = await ClientApplication.create({
    role: role || 'Creator',
    name,
    email,
    country,
    serviceType,
    volume,
    budget,
    message,
    platform,
    contentDetails,
  });

  // 2. Await Nodemailer SMTP Email Dispatch before sending HTTP 201 response
  try {
    const appPayload = savedApp.toObject ? savedApp.toObject() : { ...req.body, _id: savedApp._id };
    const emailResult = await sendInquiryEmail(appPayload);
    console.log(`[Email Dispatch Status for ${email}]: ${emailResult ? 'SUCCESS' : 'FAILED'}`);
  } catch (emailErr) {
    console.error('❌ Error sending inquiry notification email:', emailErr.message || emailErr);
  }

  return res.status(201).json(savedApp);
});

// @desc    Delete application directly from MongoDB
// @route   DELETE /api/applications/:id
// @access  Private (admin)
const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedApp = await ClientApplication.findByIdAndDelete(id);

  if (!deletedApp) {
    res.status(404);
    throw new Error('Application not found');
  }

  return res.json({ success: true, id });
});

module.exports = { getApplications, createApplication, deleteApplication };
