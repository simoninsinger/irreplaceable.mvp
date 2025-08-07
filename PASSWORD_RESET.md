# Password Reset System Documentation

This document explains the password reset functionality implemented for the Irreplaceable platform.

## Overview

The password reset system allows users to securely reset their passwords when they forget them. It uses email-based verification with secure tokens and provides a seamless user experience.

## System Flow

### 1. Password Reset Request
1. User clicks "Forgot password?" on the signin page
2. User enters their email address on `/auth/forgot-password`
3. System generates a secure reset token
4. Reset email is sent to the user
5. Success message shown (regardless of whether email exists - security feature)

### 2. Password Reset Confirmation  
1. User clicks the reset link in their email
2. User is redirected to `/auth/reset-password?token=...`
3. Token is validated on page load
4. User enters and confirms their new password
5. Password is updated and user is redirected to signin

## API Endpoints

### POST `/api/auth/reset-password`
**Request password reset email**

```javascript
// Request
{
  "email": "user@example.com"
}

// Response (always success to prevent enumeration)
{
  "success": true,
  "message": "If an account with that email exists, we've sent you a password reset link."
}
```

**Security Features:**
- Always returns success (prevents email enumeration attacks)
- Generates cryptographically secure tokens
- Tokens expire after 1 hour
- Deletes existing reset tokens before creating new ones

### PATCH `/api/auth/reset-password`
**Reset password with token**

```javascript
// Request
{
  "token": "abc123...",
  "password": "newSecurePassword123"
}

// Response
{
  "success": true,
  "message": "Password has been reset successfully."
}
```

**Process:**
1. Validates token existence and expiration
2. Validates password strength requirements
3. Hashes new password with bcrypt (12 rounds)
4. Updates user password in database
5. Marks email as verified (if not already)
6. Deletes used reset token
7. Cleans up any other reset tokens for that user

### GET `/api/auth/reset-password?token=...`
**Validate reset token**

```javascript
// Response
{
  "success": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

## Database Schema

Uses the existing `VerificationToken` model with a special identifier format:

```prisma
model VerificationToken {
  identifier String   // Format: "password-reset:user@example.com"
  token      String   @unique // Secure random token
  expires    DateTime // 1 hour from creation
}
```

## Security Features

### Token Security
- **Cryptographically Secure**: Uses `crypto.randomBytes(32)`
- **Short Expiration**: 1-hour lifetime
- **Single Use**: Tokens deleted after successful use
- **Cleanup**: Old tokens removed when new ones created

### Anti-Enumeration Protection
- Always returns success message regardless of email existence
- Doesn't reveal whether an email address has an account
- Prevents attackers from discovering valid email addresses

### Password Validation
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter  
- Must contain at least one number
- Passwords hashed with bcrypt (12 rounds)

## Email Template

The password reset email includes:

### Professional Design
- Irreplaceable branding and colors
- Mobile responsive layout
- Clear call-to-action button

### Security Information
- 1-hour expiration notice
- Security warnings about unsolicited emails
- Clear instructions for next steps

### User Experience
- Alternative text link if button doesn't work
- Contact information for support
- Professional, reassuring tone

## User Interface

### Forgot Password Page (`/auth/forgot-password`)
- Clean, focused form with email input
- Clear instructions and expectations
- Success state with next steps
- Security information and tips
- Links back to signin and signup

### Reset Password Page (`/auth/reset-password`)
- Token validation on page load
- Strong password requirements
- Password confirmation field
- Show/hide password toggles
- Real-time validation feedback
- Success state with signin link

### Integration Points
- "Forgot password?" link on signin page
- Error handling for expired/invalid tokens
- Responsive design for all devices

## Configuration

### Environment Variables
```env
# Email settings (reuses existing email configuration)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@irreplaceable.careers"

# Base URL for reset links
NEXTAUTH_URL="http://localhost:3001"
```

### Email Provider Setup
The system reuses the existing email configuration from the email verification system. Supports:
- Gmail SMTP (with app passwords)
- SendGrid
- AWS SES
- Any SMTP provider

## Error Handling

### Common Scenarios
1. **Invalid Token**: Clear error message with option to request new reset
2. **Expired Token**: Helpful message explaining expiration with retry option  
3. **Weak Password**: Real-time validation with clear requirements
4. **Network Errors**: Friendly error messages with retry prompts
5. **Email Sending Failures**: Logged but don't block the flow

### User Experience
- Graceful error states with helpful messages
- Clear recovery paths for all error scenarios
- No technical jargon or confusing error codes
- Consistent visual design with rest of platform

## Testing

### Manual Testing Checklist
- [ ] Request password reset with valid email
- [ ] Request password reset with invalid email (should still show success)
- [ ] Click reset link and verify token validation
- [ ] Set new password with various strength levels
- [ ] Try expired token (wait 1 hour or modify database)
- [ ] Try invalid token
- [ ] Verify password confirmation matching
- [ ] Test signin with new password
- [ ] Check email formatting on different clients

### Security Testing
- [ ] Verify tokens are cryptographically secure
- [ ] Confirm tokens expire after 1 hour
- [ ] Test that used tokens are properly deleted
- [ ] Verify no email enumeration is possible
- [ ] Test password hashing is secure (bcrypt with 12 rounds)

## Integration with NextAuth

The password reset system integrates seamlessly with NextAuth:

- Updates the same password field used by credentials provider
- Automatically marks email as verified during reset
- Compatible with existing session management
- Uses same user identification methods

## Monitoring

### Metrics to Track
1. **Reset Request Rate**: Number of password reset requests per day
2. **Reset Completion Rate**: % of users who complete the reset process
3. **Email Delivery Rate**: Success rate of email sending
4. **Token Expiration Rate**: % of tokens that expire unused
5. **Security Events**: Invalid token attempts, suspicious patterns

### Logging
The system logs:
- Password reset requests (with email hash for privacy)
- Email sending success/failure
- Token validation attempts
- Password update success/failure
- Security-related events

## Best Practices

### Security
1. **Regular Token Cleanup**: Implement scheduled cleanup of expired tokens
2. **Rate Limiting**: Add rate limiting to reset request endpoint
3. **Monitoring**: Watch for suspicious patterns or abuse
4. **Email Security**: Use SPF/DKIM for email authentication

### User Experience
1. **Clear Communication**: Set proper expectations about timing
2. **Mobile Optimization**: Ensure emails and pages work on mobile
3. **Accessibility**: Use proper ARIA labels and semantic HTML
4. **Error Recovery**: Always provide clear paths to recovery

### Performance
1. **Token Generation**: Use efficient crypto methods
2. **Database Queries**: Index verification tokens table
3. **Email Sending**: Use reliable email service providers
4. **Caching**: Don't cache reset pages or tokens

This password reset system provides secure, user-friendly password recovery while maintaining high security standards and preventing common attack vectors.