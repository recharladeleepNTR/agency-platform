const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const ClientApplication = require('./models/ClientApplication');
const { sendInquiryEmail } = require('./config/mailer');

async function runDiagnostic() {
  console.log('=============== 🔍 BACKEND END-TO-END DIAGNOSTIC CHECK ===============\n');

  // 1. MONGODB ATLAS DATABASE TEST
  console.log('--- 1. Testing MongoDB Atlas Database Connection & CRUD ---');
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in backend/.env!');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas Connection: SUCCESSFUL!');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database Name: ${mongoose.connection.name || 'lazydition'}`);

    // CREATE test document
    const testDoc = await ClientApplication.create({
      role: 'Diagnostic Test Role',
      name: 'Diagnostic Tester',
      email: 'diagnostic@test.com',
      country: 'USA',
      serviceType: 'Diagnostic Check',
      platform: 'Automated Test',
      contentDetails: 'Diagnostic test document',
      volume: '1 Test',
      budget: '$0',
      message: 'Automated end-to-end diagnostic test run',
    });
    console.log(`✅ Create Document in ClientApplication collection: SUCCESSFUL! (ID: ${testDoc._id})`);

    // READ test document
    const fetchedDoc = await ClientApplication.findById(testDoc._id);
    if (fetchedDoc && fetchedDoc.name === 'Diagnostic Tester') {
      console.log(`✅ Read Document from ClientApplication collection: SUCCESSFUL!`);
    } else {
      console.error(`❌ Read Document FAILED: Document not found or name mismatch.`);
    }

    // DELETE test document
    await ClientApplication.findByIdAndDelete(testDoc._id);
    console.log(`✅ Delete Test Document from ClientApplication collection: SUCCESSFUL!\n`);

  } catch (err) {
    console.error(`❌ MongoDB Atlas Test FAILED: ${err.message}\n`);
  }

  // 2. NODEMAILER / GMAIL SMTP EMAIL DISPATCH TEST
  console.log('--- 2. Testing Email Dispatch System (Nodemailer & SMTP) ---');
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const targetEmail = process.env.CLIENT_NOTIFICATION_EMAIL || 'lazydition@gmail.com';

    console.log(`   SMTP User: ${smtpUser || 'MISSING'}`);
    console.log(`   Notification Email Target: ${targetEmail}`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();
    console.log('✅ SMTP Transporter Authentication: SUCCESSFUL!');

    const emailSent = await sendInquiryEmail({
      role: 'Diagnostic Check',
      name: 'Diagnostic System Test',
      email: 'test@lazydition.com',
      country: 'India',
      serviceType: 'System Test',
      platform: 'Web App',
      contentDetails: 'Testing live notification delivery to lazydition@gmail.com',
      volume: '1 Test',
      budget: '$0',
      message: 'This is an automated test email confirming your contact form email notification pipeline is 100% working.',
    });

    if (emailSent) {
      console.log(`✅ Live Test Email Delivery to ${targetEmail}: SUCCESSFUL!\n`);
    } else {
      console.error(`❌ Live Test Email Delivery FAILED!\n`);
    }
  } catch (err) {
    console.error(`❌ Email Dispatch System Test FAILED: ${err.message}\n`);
  }

  console.log('========================================================================');
  process.exit(0);
}

runDiagnostic();
