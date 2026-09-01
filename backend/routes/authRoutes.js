const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const { sendOTPEmail } = require('../config/mailer');

// Helper to seed default admin credentials on startup
const seedAdmin = async () => {
  try {
    const admin = await AdminUser.findOne({ email: 'lazydition@gmail.com' });
    if (!admin) {
      await AdminUser.create({
        email: 'lazydition@gmail.com',
        password: 'adminsuhas007'
      });
      console.log('🔑 Admin Account Seeded: lazydition@gmail.com / adminsuhas007');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

seedAdmin();

// @desc    Admin Login
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    let admin = await AdminUser.findOne({ email: cleanEmail });

    // Fallback seed if DB was purged
    if (!admin && cleanEmail === 'lazydition@gmail.com') {
      admin = await AdminUser.create({
        email: 'lazydition@gmail.com',
        password: 'adminsuhas007'
      });
    }

    if (admin && admin.password === password) {
      return res.json({ success: true, token: 'lazydition_admin_token_active', email: admin.email });
    }

    // Direct credential check fallback
    if (cleanEmail === 'lazydition@gmail.com' && password === 'adminsuhas007') {
      return res.json({ success: true, token: 'lazydition_admin_token_active', email: 'lazydition@gmail.com' });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. User ID or Password incorrect.' });
  } catch (err) {
    // Fallback check if MongoDB connection issue
    if (cleanEmail === 'lazydition@gmail.com' && password === 'adminsuhas007') {
      return res.json({ success: true, token: 'lazydition_admin_token_active', email: 'lazydition@gmail.com' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Send OTP for Password Reset
// @route   POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== 'lazydition@gmail.com') {
    return res.status(404).json({ success: false, message: 'Admin email not recognized.' });
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  try {
    let admin = await AdminUser.findOne({ email: cleanEmail });
    if (!admin) {
      admin = await AdminUser.create({
        email: cleanEmail,
        password: 'adminsuhas007',
        otpCode,
        otpExpiresAt
      });
    } else {
      admin.otpCode = otpCode;
      admin.otpExpiresAt = otpExpiresAt;
      await admin.save();
    }

    const emailSent = await sendOTPEmail(cleanEmail, otpCode);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Could not send OTP email via SMTP. Check server credentials.' });
    }

    return res.json({ success: true, message: `OTP sent successfully to ${cleanEmail}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();

  try {
    const admin = await AdminUser.findOne({ email: cleanEmail });
    if (!admin || !admin.otpCode) {
      return res.status(400).json({ success: false, message: 'No OTP request found for this email.' });
    }

    if (admin.otpCode !== cleanOtp) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit OTP code.' });
    }

    if (admin.otpExpiresAt && new Date() > admin.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new OTP.' });
    }

    // Update password and clear OTP
    admin.password = newPassword;
    admin.otpCode = null;
    admin.otpExpiresAt = null;
    await admin.save();

    return res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
