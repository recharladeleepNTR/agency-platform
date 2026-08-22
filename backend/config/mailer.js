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

module.exports = { sendInquiryEmail };
