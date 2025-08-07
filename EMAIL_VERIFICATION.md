# Email Verification System Documentation

This document explains the email verification system implemented for the Irreplaceable platform.

## Overview

The email verification system ensures that users have valid email addresses and can receive important communications. It provides security benefits and helps maintain a clean user database.

## System Architecture

### Database Schema

The system uses the existing Prisma schema with these key models:

```prisma
model User {
  emailVerified DateTime? // Null = not verified, Date = verification timestamp
  // ... other fields
}

model VerificationToken {
  identifier String   // User email
  token      String   @unique // Verification token
  expires    DateTime // Token expiration
  // ... other fields
}
```

### API Endpoints

#### 1. User Registration (`/api/auth/register`)

**POST Request:**
```javascript
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "securePassword123",
  "birthYear": "1990",
  "subscribeNewsletter": true
}
```

**Response:**
```javascript
{
  "message": "Account created successfully! Please check your email to verify your account.",
  "user": { /* user object without password */ },
  "emailSent": true
}
```

**Process:**
1. Validates input data and age requirement (16+)
2. Checks for existing users
3. Creates user with `emailVerified: null`
4. Generates secure verification token
5. Sends verification email
6. Returns success response

#### 2. Email Verification (`/api/auth/verify-email`)

**POST Request (Resend verification):**
```javascript
{
  "email": "user@example.com"
}
```

**GET Request (Verify token):**
```
/api/auth/verify-email?token=abc123...
```

**Process:**
1. Validates token and expiration
2. Updates user's `emailVerified` timestamp
3. Deletes used token
4. Redirects to success page
5. Sends welcome email

### Email Templates

#### Verification Email Features:
- **Professional Design**: Branded HTML template with Irreplaceable colors
- **Mobile Responsive**: Works on all devices
- **Clear CTA**: Prominent verification button
- **Security Info**: Expiration notice and security warnings
- **Fallback Link**: Plain text link if button doesn't work
- **Text Version**: Plain text alternative for all email clients

#### Welcome Email Features:
- **Celebration Theme**: Welcome message with next steps
- **Feature Highlights**: Overview of platform capabilities
- **Action Links**: Direct links to assessment and job browsing
- **Support Information**: Contact details for help

## User Experience Flow

### Registration Flow
1. User fills out registration form
2. Form submits to `/api/auth/register`
3. User account created (unverified)
4. Verification email sent immediately
5. User sees success message with verification instructions

### Verification Flow  
1. User clicks verification link in email
2. Token validated and user marked as verified
3. User redirected to success page with next steps
4. Welcome email sent automatically

### Login Flow
1. User can log in before verification (for basic access)
2. Verification banner shown on dashboard if unverified
3. Some features may be limited until verification
4. User can resend verification email if needed

## Components

### EmailVerificationBanner

Shows verification prompt to unverified users:

```tsx
import { EmailVerificationBanner } from '@/components/email-verification-banner'

<EmailVerificationBanner 
  userEmail={user.email}
  isVerified={!!user.emailVerified}
  onDismiss={() => setDismissed(true)}
/>
```

**Features:**
- Resend verification email
- Dismissible for user convenience
- Success state after resending
- Error handling with user-friendly messages
- Help text with troubleshooting tips

### EmailVerificationAlert

Compact version for navigation or limited space:

```tsx
import { EmailVerificationAlert } from '@/components/email-verification-banner'

<EmailVerificationAlert 
  userEmail={user.email}
  isVerified={!!user.emailVerified}
/>
```

## Configuration

### Environment Variables

Add to `.env.local`:

```env
# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@irreplaceable.careers"

# Base URL for verification links
NEXTAUTH_URL="http://localhost:3001"
```

### Gmail Setup

For Gmail SMTP:

1. Enable 2-factor authentication
2. Generate app-specific password
3. Use app password in `EMAIL_SERVER_PASSWORD`

### Production Setup

For production, consider:
- **SendGrid** - Reliable email service
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API
- **Custom SMTP** - Your email provider's SMTP

## Security Features

### Token Security
- **Cryptographically Secure**: Uses `crypto.randomBytes(32)`
- **Time-Limited**: 24-hour expiration
- **Single-Use**: Tokens deleted after verification
- **Database Stored**: Not included in JWT or client-side storage

### Email Security
- **Rate Limiting**: Prevents spam (implement at API gateway level)
- **Domain Validation**: Basic email format validation
- **No Sensitive Data**: Verification emails don't contain passwords or sensitive info

## Integration Examples

### Check Verification Status in Components

```tsx
import { useSession } from 'next-auth/react'

export function MyComponent() {
  const { data: session } = useSession()
  
  const isEmailVerified = session?.user?.emailVerified
  
  if (!isEmailVerified) {
    return <EmailVerificationBanner userEmail={session.user.email} isVerified={false} />
  }
  
  return <div>Full functionality available</div>
}
```

### Conditional Feature Access

```tsx
export function ProtectedFeature() {
  const { data: session } = useSession()
  
  if (!session?.user?.emailVerified) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p>Please verify your email to access this feature.</p>
        <EmailVerificationAlert userEmail={session.user.email} isVerified={false} />
      </div>
    )
  }
  
  return <AdvancedFeature />
}
```

### Server-Side Verification Check

```tsx
// In API routes or server components
import { prisma } from '@/lib/prisma'

export async function checkEmailVerified(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true }
  })
  
  return !!user?.emailVerified
}
```

## Monitoring & Analytics

### Track Verification Events

```typescript
import { trackEvent } from '@/components/analytics'

// Track verification email sent
trackEvent('verification_email_sent', {
  event_category: 'authentication',
  user_id: userId
})

// Track successful verification
trackEvent('email_verified', {
  event_category: 'conversion',
  user_id: userId
})
```

### Metrics to Monitor

1. **Verification Rate**: % of users who verify within 24 hours
2. **Email Deliverability**: Bounced/failed email rate
3. **Resend Requests**: How often users need to resend
4. **Time to Verification**: Average time from registration to verification

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP credentials
   - Verify EMAIL_SERVER_* environment variables
   - Check email provider settings (2FA, app passwords)

2. **Emails in spam folder**
   - Set up SPF/DKIM records
   - Use reputable email service (SendGrid, etc.)
   - Avoid spam trigger words in subject/content

3. **Token expired errors**
   - Tokens expire after 24 hours
   - Users can request new verification email
   - Check system clock synchronization

4. **Verification links not working**
   - Verify NEXTAUTH_URL is correct
   - Check if running behind proxy/load balancer
   - Ensure proper URL encoding

### Debug Mode

Enable email debugging in development:

```typescript
// In src/lib/email.ts
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email configuration error:', error)
    } else {
      console.log('Email server ready')
    }
  })
}
```

## Testing

### Manual Testing

1. Register new account with real email
2. Check email delivery and formatting
3. Click verification link and verify redirect
4. Test resend verification functionality
5. Verify login before/after email verification

### Automated Testing

```javascript
// Example test with Jest
describe('Email Verification', () => {
  it('should send verification email on registration', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUserData)
    })
    
    expect(response.status).toBe(201)
    expect(await response.json()).toHaveProperty('emailSent', true)
  })
})
```

## Best Practices

1. **Graceful Degradation**: Don't block core functionality if email fails
2. **Clear Communication**: Set user expectations about verification
3. **Easy Resend**: Make it simple to request new verification emails
4. **Mobile Optimization**: Ensure emails work well on mobile devices
5. **Accessibility**: Use semantic HTML and good color contrast
6. **Monitoring**: Track email delivery and verification rates
7. **Security**: Never expose sensitive data in verification emails

This email verification system provides a secure, user-friendly way to validate email addresses while maintaining a smooth user experience.