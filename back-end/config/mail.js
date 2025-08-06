import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  // Add these important headers
  headers: {
    'X-Priority': '1',
    'X-MSMail-Priority': 'High',
    'Importance': 'high'
  }
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"WesternGPT Team" <support@westerngpt.com>`, // Use real support email
      to: email,
      subject: `Welcome to WesternGPT, ${name}`,
      // Add plain text version (critical for deliverability)
      text: `
Hi ${name},

Welcome to WesternGPT! We're glad you joined us.

Your account is now active and ready to use. You can access your dashboard at: https://app.westerngpt.com/dashboard

If you have any questions, feel free to reach out to our support team.

Best regards,
The WesternGPT Team

---
WesternGPT Inc.
If you no longer wish to receive these emails, you can unsubscribe at: https://app.westerngpt.com/unsubscribe?email=${encodeURIComponent(email)}
      `,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WesternGPT</title>
        <style>          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          
          .header {
            background: #2563eb;
            padding: 24px;
            text-align: center;
          }
          
          .logo {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
          }
          
          .content {
            padding: 32px;
          }
          
          h1 {
            color: #111827;
            font-size: 22px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
          }
          
          p {
            font-size: 16px;
            margin-bottom: 16px;
            line-height: 1.5;
          }
          
          .cta-button {
            display: inline-block;
            background: #2563eb;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            margin: 16px 0;
          }
          
          .footer {
            padding: 24px;
            text-align: center;
            background-color: #f9fafb;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          
          .unsubscribe {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 16px;
          }
          
          .unsubscribe a {
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo">WesternGPT</h1>
          </div>
          
          <div class="content">
            <h1>Welcome, ${name}!</h1>
            
            <p>Thank you for joining WesternGPT. Your account has been successfully created and is ready to use.</p>
            
            <p>You can now access your dashboard and start exploring the features:</p>
            
            <a href="https://app.westerngpt.com/dashboard" class="cta-button">Access Dashboard</a>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The WesternGPT Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} WesternGPT Inc. All rights reserved.</p>
            <div class="unsubscribe">
              <p>You received this email because you signed up for WesternGPT.<br>
              <a href="https://app.westerngpt.com/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a> from future emails.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
      // Add email headers to improve deliverability
      headers: {
        'List-Unsubscribe': `<https://app.westerngpt.com/unsubscribe?email=${encodeURIComponent(email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Priority': '3',
        'X-Mailer': 'WesternGPT',
      }
    });
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
export const sendLoginEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"WesternGPT" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: '🔐 New Login Alert - WesternGPT',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 10px;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #334155;">We just detected a new login to your <strong>WesternGPT</strong> account.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 6px;">
              <p style="margin: 0; font-size: 15px; color: #065f46;">
                If this was you, you’re all set ✅<br />
                If not, please <a href="#" style="color: #0f766e; text-decoration: underline;">reset your password immediately</a>.
              </p>
            </div>

            <p style="font-size: 15px; color: #64748b;">Stay safe, and thanks for choosing WesternGPT!</p>
            
            <p style="margin-top: 40px; font-size: 14px; color: #94a3b8;">— The WesternGPT Team</p>
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">
              Need help? Contact us anytime at <a href="mailto:support@westerngpt.com" style="color: #3b82f6;">support@westerngpt.com</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Login email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending login email:', error);
  }
};
