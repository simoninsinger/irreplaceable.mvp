"use client"

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Replace with your actual Google Analytics measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

export function Analytics() {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || []
    
    // gtag function
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    
    // Configure Google Analytics
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      // Enable enhanced measurement for better tracking
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true,
      },
      // Custom parameters
      custom_map: {
        custom_parameter_1: 'career_interest',
        custom_parameter_2: 'assessment_score',
      }
    })
  }, [])

  // Don't load analytics in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  )
}

// Custom event tracking functions
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      // Add default parameters
      timestamp: new Date().toISOString(),
    })
  }
}

// Predefined tracking functions for common events
export const trackCareerAssessment = {
  start: () => {
    trackEvent('assessment_started', {
      event_category: 'engagement',
      event_label: 'career_assessment',
    })
  },
  
  complete: (results: Record<string, any>) => {
    trackEvent('assessment_completed', {
      event_category: 'conversion',
      event_label: 'career_assessment',
      career_match: results.topCareer || 'unknown',
      assessment_score: results.score || 0,
    })
  },
  
  question_answered: (questionId: number, answer: string) => {
    trackEvent('assessment_question_answered', {
      event_category: 'engagement',
      event_label: 'career_assessment',
      question_id: questionId,
      answer: answer,
    })
  }
}

export const trackJobInteraction = {
  view: (jobId: string, jobTitle: string, company: string) => {
    trackEvent('job_viewed', {
      event_category: 'engagement',
      event_label: 'job_interaction',
      job_id: jobId,
      job_title: jobTitle,
      company: company,
    })
  },
  
  save: (jobId: string, jobTitle: string) => {
    trackEvent('job_saved', {
      event_category: 'engagement',
      event_label: 'job_interaction',
      job_id: jobId,
      job_title: jobTitle,
    })
  },
  
  apply: (jobId: string, jobTitle: string, company: string) => {
    trackEvent('job_application_started', {
      event_category: 'conversion',
      event_label: 'job_application',
      job_id: jobId,
      job_title: jobTitle,
      company: company,
    })
  }
}

export const trackNewsletterSignup = (source: string, interests?: string[]) => {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    event_label: 'newsletter',
    signup_source: source,
    interests: interests?.join(',') || 'none',
  })
}

export const trackUserRegistration = (method: string) => {
  trackEvent('sign_up', {
    method: method, // 'email', 'google', etc.
    event_category: 'conversion',
    event_label: 'user_registration',
  })
}

export const trackContentEngagement = {
  blogPostView: (slug: string, title: string, category: string) => {
    trackEvent('blog_post_viewed', {
      event_category: 'engagement',
      event_label: 'content',
      article_slug: slug,
      article_title: title,
      article_category: category,
    })
  },
  
  blogPostShare: (slug: string, platform: string) => {
    trackEvent('blog_post_shared', {
      event_category: 'engagement',
      event_label: 'content_sharing',
      article_slug: slug,
      share_platform: platform,
    })
  },
  
  learningContentView: (contentId: string, category: string) => {
    trackEvent('learning_content_viewed', {
      event_category: 'engagement',
      event_label: 'learning',
      content_id: contentId,
      content_category: category,
    })
  }
}

export const trackContactForm = (category: string) => {
  trackEvent('contact_form_submitted', {
    event_category: 'conversion',
    event_label: 'contact',
    form_category: category,
  })
}

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}