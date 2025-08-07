# Google Analytics Setup & Usage Guide

This document explains how to set up and use Google Analytics tracking in the Irreplaceable platform.

## Setup Instructions

### 1. Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variables

Update your `.env.local` file with your actual Google Analytics Measurement ID:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-YOUR-ACTUAL-ID-HERE"
```

### 3. Verify Installation

The Analytics component is already installed in the root layout (`src/app/layout.tsx`). It will automatically:

- Load the Google Analytics script
- Initialize tracking
- Configure enhanced measurements
- Only run in production (disabled in development)

## Event Tracking

The platform includes comprehensive event tracking for key user interactions:

### Career Assessment Tracking

```typescript
import { trackCareerAssessment } from '@/components/analytics'

// Track when user starts assessment
trackCareerAssessment.start()

// Track when user answers a question
trackCareerAssessment.question_answered(questionId, answer)

// Track when user completes assessment
trackCareerAssessment.complete({
  topCareer: 'Physical Therapy',
  score: 85
})
```

### Job Interaction Tracking

```typescript
import { trackJobInteraction } from '@/components/analytics'

// Track job views
trackJobInteraction.view('job123', 'Physical Therapist', 'ABC Healthcare')

// Track job saves
trackJobInteraction.save('job123', 'Physical Therapist')

// Track job applications
trackJobInteraction.apply('job123', 'Physical Therapist', 'ABC Healthcare')
```

### Newsletter Signup Tracking

```typescript
import { trackNewsletterSignup } from '@/components/analytics'

// Track newsletter signups
trackNewsletterSignup('homepage', ['Healthcare', 'Physical Therapy'])
```

### Content Engagement Tracking

```typescript
import { trackContentEngagement } from '@/components/analytics'

// Track blog post views
trackContentEngagement.blogPostView('ai-resistant-careers', 'Top 10 AI-Resistant Careers', 'Career Insights')

// Track blog post shares
trackContentEngagement.blogPostShare('ai-resistant-careers', 'twitter')

// Track learning content views
trackContentEngagement.learningContentView('content123', 'Healthcare')
```

### User Registration Tracking

```typescript
import { trackUserRegistration } from '@/components/analytics'

// Track user signups
trackUserRegistration('email') // or 'google', 'linkedin'
```

### Contact Form Tracking

```typescript
import { trackContactForm } from '@/components/analytics'

// Track contact form submissions
trackContactForm('general') // category from form
```

### Custom Event Tracking

```typescript
import { trackEvent } from '@/components/analytics'

// Track any custom event
trackEvent('custom_event_name', {
  category: 'engagement',
  label: 'custom_interaction',
  value: 1,
  custom_parameter: 'custom_value'
})
```

## Conversion Tracking

The following events are set up as key conversions:

1. **assessment_completed** - User completes career assessment
2. **job_application_started** - User starts job application
3. **newsletter_signup** - User subscribes to newsletter
4. **sign_up** - User creates account
5. **contact_form_submitted** - User submits contact form

## Enhanced Measurements

The following enhanced measurements are automatically enabled:

- **Scrolls** - Track 90% page scroll depth
- **Outbound clicks** - Track clicks to external websites
- **Site search** - Track internal site searches
- **Video engagement** - Track video play/pause/complete
- **File downloads** - Track PDF and document downloads

## Google Analytics 4 Dashboard Setup

### Recommended Custom Reports

1. **Career Interest Analysis**
   - Dimension: Custom Parameter (career_interest)
   - Metric: Users, Sessions, Conversions

2. **Assessment Performance**
   - Events: assessment_started, assessment_completed
   - Conversion rate calculation

3. **Job Application Funnel**
   - Steps: job_viewed → job_saved → job_application_started
   - Drop-off analysis

4. **Content Performance**
   - Dimensions: Article title, Article category
   - Metrics: Page views, Time on page, Bounce rate

### Goals & Conversions

Set up these key conversion events in GA4:

1. **Primary Conversions:**
   - `assessment_completed`
   - `sign_up`
   - `job_application_started`

2. **Secondary Conversions:**
   - `newsletter_signup`
   - `contact_form_submitted`
   - `job_saved`

## Privacy & Compliance

The analytics implementation includes:

- **Consent Management**: Respects user privacy preferences
- **Data Minimization**: Only tracks necessary events
- **Anonymization**: IP addresses are automatically anonymized
- **GDPR Compliance**: Users can opt-out of tracking

## Debugging

### Development Environment

Analytics are disabled in development to avoid skewing data. To test:

1. Set `NODE_ENV=production` locally, or
2. Check browser console for gtag debug messages

### Common Issues

1. **Events not appearing**: Check measurement ID is correct
2. **Double tracking**: Ensure Analytics component is only included once
3. **Ad blockers**: Some users may have analytics blocked

## Implementation Examples

### Adding Tracking to New Components

```typescript
// In your component
import { trackEvent } from '@/components/analytics'

const handleFeatureUsage = () => {
  // Your feature logic here
  
  // Track the interaction
  trackEvent('feature_used', {
    event_category: 'engagement',
    feature_name: 'new_feature',
    user_id: userId // if available
  })
}
```

### Page View Tracking

```typescript
// For client-side routing
import { trackPageView } from '@/components/analytics'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const MyComponent = () => {
  const pathname = usePathname()
  
  useEffect(() => {
    trackPageView(pathname, document.title)
  }, [pathname])
}
```

## Performance Considerations

- Analytics script loads with `strategy="afterInteractive"`
- Only essential events are tracked to minimize impact
- Events are batched and sent asynchronously
- No blocking of user interactions

## Data Studio Integration

Connect GA4 to Google Data Studio for advanced reporting:

1. Create new Data Studio report
2. Add GA4 as data source
3. Use custom dimensions for career-specific metrics
4. Create dashboards for different stakeholders

This analytics setup provides comprehensive tracking for understanding user behavior, measuring conversion rates, and optimizing the platform for better career outcomes.