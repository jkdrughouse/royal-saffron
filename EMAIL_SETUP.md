# Email Setup Guide

The Royal Saffron app now supports email sending via multiple providers. Follow this guide to configure email functionality.

## Supported Providers

1. **SMTP** (via nodemailer) - Gmail, Outlook, custom SMTP servers
2. **Resend** - Modern email API
3. **SendGrid** - Enterprise email service

## Configuration

Create a `.env.local` file in your project root and add the following variables based on your chosen provider:

### Option 1: SMTP (Gmail, Outlook, etc.)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Royal Saffron <noreply@royalsaffron.com>
```

**For Gmail:**
- Use App Password, not your regular password
- Enable 2-Factor Authentication first
- Generate App Password: https://myaccount.google.com/apppasswords

### Option 2: Resend

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Royal Saffron <noreply@royalsaffron.com>
```

Get your API key: https://resend.com/api-keys

### Option 3: SendGrid

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@royalsaffron.com
```

Get your API key: https://app.sendgrid.com/settings/api_keys

## Email Features

The app automatically sends emails for:

1. **Password Reset OTP** - When users request password reset
2. **Order Confirmation** - When an order is placed
3. **Order Status Updates** - When order status changes (confirmed, shipped, delivered, etc.)

## Development Mode

In development mode (`NODE_ENV=development`), if email sending fails, the app will:
- Log the email content to console
- Still return success (to avoid blocking development)

## Testing

1. Test password reset flow - Check your email for OTP
2. Place a test order - Check for order confirmation email
3. Update order status (in admin) - Check for status update email

## Troubleshooting

### Emails not sending?
- Check your environment variables are set correctly
- Verify your API keys/credentials are valid
- Check console logs for error messages
- In development, emails are logged to console if sending fails

### SMTP Connection Issues
- Verify firewall/network allows SMTP connections
- Check if your email provider requires special settings
- Some providers block SMTP from cloud hosting (use Resend/SendGrid instead)

## Production Recommendations

- Use a dedicated email service (Resend or SendGrid) for reliability
- Set up email domain verification for better deliverability
- Monitor email sending rates and quotas
- Set up bounce handling and unsubscribe mechanisms
