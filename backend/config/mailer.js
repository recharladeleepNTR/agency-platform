const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendInquiryEmail = async (applicationData) => {
  const clientEmail = process.env.CLIENT_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  if (!clientEmail) {
    console.log('CLIENT_NOTIFICATION_EMAIL not set in .env. Inquiry saved in DB & Admin Dashboard.');
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Notification Engine] Application from ${applicationData.email} stored for client: ${clientEmail}`);
    return false;
  }

  const mailOptions = {
    from: `"Agency Platform" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    replyTo: applicationData.email,
    subject: `🚨 New Client Application: ${applicationData.name} (${applicationData.role || 'Creator'})`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #07000e; color: #ffffff; padding: 30px; border-radius: 16px;">
        <h2 style="color: #9494ff; margin-bottom: 20px;">New Client Application Received</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Client Name:</td><td style="font-weight: bold; color: #ffffff;">${applicationData.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Client Email:</td><td style="font-weight: bold; color: #9494ff;"><a href="mailto:${applicationData.email}" style="color: #9494ff;">${applicationData.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Service Requested:</td><td style="font-weight: bold; color: #ffffff;">${applicationData.serviceType}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Target Platform:</td><td style="font-weight: bold; color: #ffffff;">${applicationData.platform || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Volume:</td><td style="font-weight: bold; color: #ffffff;">${applicationData.volume}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Budget:</td><td style="font-weight: bold; color: #9494ff;">${applicationData.budget}</td></tr>
          <tr><td style="padding: 8px 0; color: #aaaaaa;">Country:</td><td style="font-weight: bold; color: #ffffff;">${applicationData.country}</td></tr>
        </table>

        ${applicationData.contentDetails ? `<div style="background: #140622; padding: 15px; border-radius: 10px; margin-bottom: 15px;"><strong>Content Details:</strong> ${applicationData.contentDetails}</div>` : ''}

        <div style="background: #140622; padding: 15px; border-radius: 10px;">
          <strong>Message:</strong><br/>
          <em>"${applicationData.message}"</em>
        </div>

        <p style="font-size: 12px; color: #777777; margin-top: 25px;">
          Sent automatically from your Agency Platform Contact Form.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Inquiry notification email successfully sent to ${clientEmail}`);
    return true;
  } catch (err) {
    console.error('Failed to send email notification:', err.message);
    return false;
  }
};

const sendOTPEmail = async (targetEmail, otpCode) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.error('SMTP Transporter unavailable for sending OTP');
    return false;
  }

  const mailOptions = {
    from: `"Lazydition Security" <${process.env.SMTP_USER || 'lazydition@gmail.com'}>`,
    to: targetEmail,
    subject: `🔐 Your Lazydition Admin OTP Code: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0e0014; color: #ffffff; padding: 35px; border-radius: 20px; border: 2px solid #9494ff40; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #9494ff; margin-bottom: 10px; text-align: center;">Lazydition Admin Security</h2>
        <p style="color: #cccccc; font-size: 14px; text-align: center; margin-bottom: 25px;">
          You requested a password reset for your Lazydition Admin Dashboard.
        </p>

        <div style="background: #180926; border: 2px solid #9494ff; padding: 20px; border-radius: 16px; text-align: center; margin-bottom: 25px;">
          <span style="font-size: 12px; color: #9494ff; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Your 6-Digit OTP Code</span>
          <div style="font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: 10px; margin-top: 10px; font-family: monospace;">
            ${otpCode}
          </div>
        </div>

        <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
          This OTP code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email (${otpCode}) successfully sent to ${targetEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err.message);
    return false;
  }
};

module.exports = { sendInquiryEmail, sendOTPEmail };
