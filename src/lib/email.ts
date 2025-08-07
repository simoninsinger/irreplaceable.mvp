import nodemailer from 'nodemailer'

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
}

// Create reusable transporter
const transporter = nodemailer.createTransporter(emailConfig)

// Verify email configuration on startup (in development only)
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email configuration error:', error)
    } else {
      console.log('Email server is ready to send messages')
    }
  })
}

export async function sendVerificationEmail(
  to: string,
  userName: string,
  token: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Irreplaceable</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 30px;
          color: #4b5563;
        }
        .verify-button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
        }
        .verify-button:hover {
          background: #2563eb;
        }
        .alternative-link {
          margin-top: 20px;
          padding: 20px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 14px;
          color: #64748b;
        }
        .footer {
          padding: 20px 30px;
          background: #f8fafc;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #64748b;
        }
        .security-note {
          margin-top: 30px;
          padding: 15px;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 4px;
          font-size: 14px;
          color: #92400e;
        }
        @media (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <h1>🛡️ Irreplaceable</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify Your Email Address</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hello ${userName}! 👋
            </div>
            
            <div class="message">
              <p>Welcome to Irreplaceable! We're excited to help you discover and build an AI-resistant career that celebrates your uniquely human skills.</p>
              
              <p>To get started and ensure the security of your account, please verify your email address by clicking the button below:</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-button">
                Verify My Email Address
              </a>
            </div>
            
            <div class="alternative-link">
              <strong>Button not working?</strong><br>
              Copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
            </div>
            
            <div class="security-note">
              <strong>🔒 Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with Irreplaceable, you can safely ignore this email.
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Irreplaceable</strong> - Building AI-Resistant Careers</p>
            <p>Need help? Reply to this email or contact us at support@irreplaceable.careers</p>
            <p>&copy; 2025 Irreplaceable. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    Welcome to Irreplaceable!
    
    Hello ${userName},
    
    Welcome to Irreplaceable! We're excited to help you discover and build an AI-resistant career that celebrates your uniquely human skills.
    
    To get started and ensure the security of your account, please verify your email address by visiting this link:
    
    ${verificationUrl}
    
    This verification link will expire in 24 hours.
    
    If you didn't create an account with Irreplaceable, you can safely ignore this email.
    
    Need help? Reply to this email or contact us at support@irreplaceable.careers
    
    Best regards,
    The Irreplaceable Team
    
    ---
    Irreplaceable - Building AI-Resistant Careers
    © 2025 Irreplaceable. All rights reserved.
  `

  const mailOptions = {
    from: `"Irreplaceable" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: 'Verify Your Email Address - Irreplaceable',
    text: textContent,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Verification email sent to ${to}`)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Irreplaceable!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px 0;
        }
        .features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .feature {
          padding: 15px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <h1>🎉 Welcome to Irreplaceable!</h1>
            <p>Your AI-resistant career journey starts now</p>
          </div>
          
          <div class="content">
            <p>Hello ${userName},</p>
            
            <p>Congratulations! Your email has been verified and you're now part of the Irreplaceable community.</p>
            
            <p>Here's what you can do next:</p>
            
            <div class="features">
              <div class="feature">
                <strong>📊 Take Your Career Assessment</strong><br>
                Discover which AI-resistant careers match your skills and interests.
              </div>
              <div class="feature">
                <strong>🔍 Browse AI-Resistant Jobs</strong><br>
                Explore hundreds of future-proof job opportunities.
              </div>
              <div class="feature">
                <strong>📚 Access Learning Resources</strong><br>
                Build skills that will keep you valuable in the AI economy.
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/assessment" class="cta-button">Take Your Assessment</a>
              <a href="${baseUrl}/jobs" class="cta-button">Browse Jobs</a>
            </div>
            
            <p>Questions? We're here to help! Reply to this email or contact us at support@irreplaceable.careers</p>
            
            <p>Welcome aboard!</p>
            <p>The Irreplaceable Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"Irreplaceable" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: '🎉 Welcome to Irreplaceable - Your AI-Resistant Career Journey Starts Now!',
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent to ${to}`)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error for welcome email - it's not critical
  }
}

export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  token: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Irreplaceable</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #ef4444;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 30px;
        }
        .reset-button {
          display: inline-block;
          background: #ef4444;
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .security-warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #b91c1c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <h1>🔒 Reset Your Password</h1>
          </div>
          
          <div class="content">
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your password for your Irreplaceable account. If you made this request, click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <p>This password reset link will expire in 1 hour for security reasons.</p>
            
            <div class="security-warning">
              <strong>⚠️ Important:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </div>
            
            <p>For security questions, contact us at support@irreplaceable.careers</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"Irreplaceable Security" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: '🔒 Reset Your Password - Irreplaceable',
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent to ${to}`)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}