const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

// Validate email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  console.warn('Email service not configured. EMAIL_USER and EMAIL_APP_PASSWORD environment variables are required.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify transporter configuration
if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter.verify()
    .then(() => {
      console.log(' Email service is ready');
      console.log('Email configured with:', process.env.EMAIL_USER);
    })
    .catch(error => {
      console.error(' Email service configuration error:', error.message);
      console.error('Full error:', error);
      console.log('Please check:');
      console.log('1. EMAIL_USER is set correctly');
      console.log('2. EMAIL_APP_PASSWORD is a valid 16-character app password');
      console.log('3. 2-Factor Authentication is enabled on your Gmail account');
      console.log('4. Less secure app access is disabled (use app password instead)');
    });
}

const formatDate = (date) => {
  return moment(date).format('dddd, MMMM D, YYYY');
};

const formatTime = (time) => {
  return moment(time, 'HH:mm').format('h:mm A');
};

const sendBookingConfirmation = async (booking, eventType) => {
  const bookingDate = formatDate(booking.date);
  const startTime = formatTime(booking.startTime);
  const endTime = formatTime(booking.endTime);
  
  // Email to the guest (person who booked)
  const guestEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        .success-icon { width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .checkmark { color: white; font-size: 30px; font-weight: bold; }
        h1 { color: #1f2937; margin: 0; }
        .event-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .event-title { display: flex; align-items: center; margin-bottom: 15px; }
        .color-bar { width: 4px; height: 50px; border-radius: 2px; margin-right: 15px; background-color: ${eventType.color || '#3b82f6'}; }
        .event-name { font-size: 20px; font-weight: bold; color: #1f2937; }
        .event-description { color: #6b7280; margin-top: 5px; }
        .detail-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .detail-row:last-child { border-bottom: none; }
        .detail-icon { margin-right: 12px; color: #9ca3af; }
        .detail-content { color: #1f2937; font-weight: 500; }
        .notes-section { background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .booking-id { color: #9ca3af; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">
            <span class="checkmark">✓</span>
          </div>
          <h1>Booking Confirmed!</h1>
          <p style="color: #6b7280; margin-top: 10px;">Your booking has been successfully confirmed.</p>
        </div>
        
        <div class="event-card">
          <div class="event-title">
            <div class="color-bar"></div>
            <div>
              <div class="event-name">${eventType.title}</div>
              ${eventType.description ? `<div class="event-description">${eventType.description}</div>` : ''}
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">📅</div>
            <div class="detail-content">${bookingDate}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">🕐</div>
            <div class="detail-content">${startTime} - ${endTime} (${eventType.duration} minutes)</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">👤</div>
            <div class="detail-content">${booking.name}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">✉️</div>
            <div class="detail-content">${booking.email}</div>
          </div>
          
          ${booking.notes ? `
          <div class="notes-section">
            <strong>Additional Notes:</strong>
            <p style="margin: 8px 0 0 0;">${booking.notes}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">What's Next?</h3>
          <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
            <li>Add this event to your calendar</li>
            <li>Prepare any materials you might need</li>
            <li>Join at the scheduled time</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Booking ID: <span class="booking-id">#${booking.id}</span></p>
          <p>If you need to reschedule or cancel, please contact us.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Email to the owner (event creator)
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        h1 { margin: 0; }
        .booking-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .event-title { display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f3f4f6; }
        .color-bar { width: 4px; height: 50px; border-radius: 2px; margin-right: 15px; background-color: ${eventType.color || '#3b82f6'}; }
        .event-name { font-size: 20px; font-weight: bold; color: #1f2937; }
        .section { margin: 20px 0; }
        .section-title { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
        .section-content { color: #1f2937; font-size: 16px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .notes-section { background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Booking Received!</h1>
          <p style="margin-top: 10px; opacity: 0.9;">You have a new booking on your calendar.</p>
        </div>
        
        <div class="booking-card">
          <div class="event-title">
            <div class="color-bar"></div>
            <div>
              <div class="event-name">${eventType.title}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Date & Time</div>
            <div class="section-content">
              📅 ${bookingDate}<br>
              🕐 ${startTime} - ${endTime} (${eventType.duration} minutes)
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="section-content">
              <strong>Name:</strong> ${booking.name}<br>
              <strong>Email:</strong> ${booking.email}
            </div>
          </div>
          
          ${booking.notes ? `
          <div class="notes-section">
            <div class="section-title">Guest Notes</div>
            <div class="section-content">${booking.notes}</div>
          </div>
          ` : ''}
          
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 15px; margin-top: 20px;">
            <p style="margin: 0; color: #166534;">
              ✓ The guest has been sent a confirmation email with all the details.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>Booking ID: #${booking.id}</p>
          <p>Manage your bookings in your dashboard.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    // Send email to guest
    console.log(`Sending confirmation email to ${booking.email}...`);
    await transporter.sendMail({
      from: `"Scheduling Platform" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `Booking Confirmed: ${eventType.title} on ${bookingDate}`,
      html: guestEmailHtml
    });
    console.log(`✅ Guest email sent to ${booking.email}`);
    
    // Send email to owner
    console.log(`Sending notification email to owner ${process.env.OWNER_EMAIL}...`);
    await transporter.sendMail({
      from: `"Scheduling Platform" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Booking: ${eventType.title} - ${booking.name}`,
      html: ownerEmailHtml
    });
    console.log(`✅ Owner email sent to ${process.env.OWNER_EMAIL}`);
    
    console.log('✅ All booking confirmation emails sent successfully');
  } catch (error) {
    console.error('❌ Error sending booking confirmation emails:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    throw error;
  }
};

const sendCancellationEmail = async (booking, eventType) => {
  const bookingDate = formatDate(booking.date);
  const startTime = formatTime(booking.startTime);
  
  // Email to guest
  const guestEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #fef2f2; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; border: 1px solid #fecaca; }
        h1 { color: #991b1b; margin: 0; }
        .booking-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancelled</h1>
          <p style="color: #991b1b; margin-top: 10px;">Your booking has been cancelled.</p>
        </div>
        
        <div class="booking-card">
          <h2 style="color: #1f2937; margin-top: 0;">${eventType.title}</h2>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Guest:</strong> ${booking.name}</p>
          <p style="margin-top: 20px; color: #6b7280;">If you'd like to reschedule, please book a new time slot.</p>
        </div>
        
        <div class="footer">
          <p>Booking ID: #${booking.id}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Email to owner
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        .booking-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        <div class="booking-card">
          <h2>${eventType.title}</h2>
          <p><strong>Guest:</strong> ${booking.name} (${booking.email})</p>
          <p><strong>Was scheduled for:</strong> ${bookingDate} at ${startTime}</p>
          <p style="margin-top: 20px; color: #6b7280;">The guest has been notified of the cancellation.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: `"Scheduling Platform" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `Booking Cancelled: ${eventType.title}`,
      html: guestEmailHtml
    });
    
    await transporter.sendMail({
      from: `"Scheduling Platform" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `Booking Cancelled: ${eventType.title} - ${booking.name}`,
      html: ownerEmailHtml
    });
    
    console.log('Cancellation emails sent successfully');
  } catch (error) {
    console.error('Error sending cancellation emails:', error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationEmail
};
