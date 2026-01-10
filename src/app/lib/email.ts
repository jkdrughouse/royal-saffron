// Email service utility
// Supports multiple email providers: SMTP (via nodemailer), Resend, SendGrid, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
  
  try {
    switch (emailProvider) {
      case 'resend':
        return await sendEmailViaResend(options);
      case 'sendgrid':
        return await sendEmailViaSendGrid(options);
      case 'smtp':
      default:
        return await sendEmailViaSMTP(options);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    
    // In development, log the email instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== EMAIL (DEV MODE) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text || options.html);
      console.log('======================\n');
      return true;
    }
    
    return false;
  }
}

// Send via Resend
async function sendEmailViaResend(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Royal Saffron <noreply@royalsaffron.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${error.message || 'Unknown error'}`);
  }
  
  return true;
}

// Send via SendGrid
async function sendEmailViaSendGrid(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: options.to }],
      }],
      from: {
        email: process.env.EMAIL_FROM || 'noreply@royalsaffron.com',
        name: 'Royal Saffron',
      },
      subject: options.subject,
      content: [
        {
          type: 'text/plain',
          value: options.text || options.html.replace(/<[^>]*>/g, ''),
        },
        {
          type: 'text/html',
          value: options.html,
        },
      ],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }
  
  return true;
}

// Send via SMTP (using nodemailer - requires installation)
async function sendEmailViaSMTP(options: EmailOptions): Promise<boolean> {
  // Dynamic import to avoid breaking if nodemailer is not installed
  try {
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });
    
    return true;
  } catch (error: any) {
    // If nodemailer is not installed, fall back to dev mode
    if (error.code === 'MODULE_NOT_FOUND') {
      console.warn('nodemailer not installed. Using dev mode for emails.');
      return false; // Will trigger dev mode in sendEmail
    }
    throw error;
  }
}

// Email templates

export function getOTPEmailHTML(otp: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #d97706; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp { font-size: 32px; font-weight: bold; color: #d97706; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          <p>You requested to reset your password for your Royal Saffron account. Use the OTP below to proceed:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP is:</p>
            <div class="otp">${otp}</div>
          </div>
          <p>This OTP is valid for <strong>5 minutes</strong> only.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Royal Saffron - Jhelum Kesar Co.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getOrderConfirmationEmailHTML(order: {
  id: string;
  items: Array<{ name: string; quantity: number; price: number; variant?: number; unit?: string }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: { name: string; address: string; city: string; state: string; pincode: string };
}): string {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}${item.variant ? ` (${item.variant}${item.unit || 'g'})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
        th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #d97706; }
        .total-row { font-weight: bold; font-size: 18px; }
        .address-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p style="margin: 0;">Order #${order.id}</p>
        </div>
        <div class="content">
          <p>Thank you for your order! We've received your order and will process it shortly.</p>
          
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr>
                <td colspan="3" style="padding: 10px; border-top: 2px solid #e5e7eb; text-align: right;">Subtotal:</td>
                <td style="padding: 10px; border-top: 2px solid #e5e7eb; text-align: right;">₹${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;">Shipping:</td>
                <td style="padding: 10px; text-align: right;">₹${order.shipping.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="padding: 10px; border-top: 2px solid #d97706; text-align: right;">Total:</td>
                <td style="padding: 10px; border-top: 2px solid #d97706; text-align: right;">₹${order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="address-box">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p style="margin: 5px 0;">${order.shippingAddress.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
          </div>
          
          <p>We'll send you another email when your order ships. You can track your order status in your account.</p>
          <p>If you have any questions, please contact us via WhatsApp or email.</p>
          <p>Best regards,<br>Royal Saffron - Jhelum Kesar Co.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getOrderStatusUpdateEmailHTML(order: {
  id: string;
  status: string;
  trackingNumber?: string;
  courierService?: string;
}): string {
  const statusMessages: Record<string, { title: string; message: string }> = {
    confirmed: { title: '✅ Order Confirmed', message: 'Your order has been confirmed and is being prepared for shipment.' },
    processing: { title: '📦 Order Processing', message: 'Your order is being processed and will be shipped soon.' },
    shipped: { title: '🚚 Order Shipped', message: 'Great news! Your order has been shipped and is on its way.' },
    delivered: { title: '🎉 Order Delivered', message: 'Your order has been delivered! We hope you enjoy your purchase.' },
    cancelled: { title: '❌ Order Cancelled', message: 'Your order has been cancelled. If you have any questions, please contact us.' },
  };
  
  const statusInfo = statusMessages[order.status] || { 
    title: 'Order Update', 
    message: `Your order status has been updated to: ${order.status}` 
  };
  
  const trackingHTML = order.trackingNumber && order.courierService ? `
    <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
      <h3 style="margin-top: 0;">Tracking Information</h3>
      <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
      <p><strong>Courier:</strong> ${order.courierService}</p>
      <p>You can track your package using the tracking number above.</p>
    </div>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusInfo.title}</h1>
          <p style="margin: 0;">Order #${order.id}</p>
        </div>
        <div class="content">
          <p>${statusInfo.message}</p>
          ${trackingHTML}
          <p>You can view your order details and track its status in your account.</p>
          <p>If you have any questions, please contact us via WhatsApp or email.</p>
          <p>Best regards,<br>Royal Saffron - Jhelum Kesar Co.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
