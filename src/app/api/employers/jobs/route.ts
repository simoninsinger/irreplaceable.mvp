import { NextRequest, NextResponse } from 'next/server'
import { JobListing } from '@/lib/job-apis'

// Interface for employer job posting
interface EmployerJobPosting {
  // Company Information
  companyName: string
  companyEmail: string
  companyWebsite?: string
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  
  // Job Details  
  jobTitle: string
  jobDescription: string
  requirements: string[]
  responsibilities: string[]
  location: string
  isRemote: boolean
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary'
  
  // Compensation
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  salaryPeriod: 'hourly' | 'monthly' | 'yearly'
  benefits: string[]
  
  // Experience & Skills
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  requiredSkills: string[]
  preferredSkills: string[]
  education: string[]
  certifications: string[]
  
  // Application Details
  applicationUrl?: string
  applicationEmail?: string
  applicationInstructions?: string
  
  // Meta
  category: string
  expiryDate?: Date
  isUrgent: boolean
  contactPerson: string
  contactPhone?: string
}

// POST endpoint for employers to submit job postings
export async function POST(request: NextRequest) {
  try {
    const body: EmployerJobPosting = await request.json()
    
    // Validation
    const requiredFields = [
      'companyName', 'companyEmail', 'jobTitle', 'jobDescription',
      'location', 'experienceLevel', 'category', 'contactPerson'
    ]
    
    for (const field of requiredFields) {
      if (!body[field as keyof EmployerJobPosting]) {
        return NextResponse.json({
          success: false,
          message: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.companyEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    // Calculate AI resistance score for the job
    const aiResistanceScore = calculateJobAIResistance(body.jobTitle, body.jobDescription, body.requiredSkills)
    
    // Convert to JobListing format
    const jobListing: JobListing = {
      id: `employer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.jobTitle,
      company: body.companyName,
      location: body.location,
      description: body.jobDescription,
      requirements: body.requirements,
      salary: body.salaryMin && body.salaryMax ? {
        min: body.salaryMin,
        max: body.salaryMax,
        currency: body.salaryCurrency,
        period: body.salaryPeriod
      } : undefined,
      aiResistanceScore,
      category: body.category,
      remote: body.isRemote,
      experience: body.experienceLevel,
      postedDate: new Date(),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      url: body.applicationUrl || `mailto:${body.companyEmail}?subject=Application for ${body.jobTitle}`,
      source: 'employer',
      tags: [...body.requiredSkills, ...body.preferredSkills].slice(0, 8),
      benefits: body.benefits
    }

    // Here you would typically:
    // 1. Save to database with approval status: 'pending'
    // 2. Send confirmation email to employer
    // 3. Send notification to admin for review
    // 4. Add to moderation queue

    // For now, we'll simulate saving and return success
    const submissionId = `SUB_${Date.now()}`
    
    // Send confirmation email to employer (you would implement this)
    try {
      await sendEmployerConfirmationEmail(body.companyEmail, {
        companyName: body.companyName,
        jobTitle: body.jobTitle,
        submissionId,
        aiResistanceScore
      })
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }

    // Send notification to admin (you would implement this)
    try {
      await notifyAdminNewJobPosting({
        ...body,
        submissionId,
        aiResistanceScore,
        submittedAt: new Date()
      })
    } catch (error) {
      console.error('Failed to notify admin:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting submitted successfully',
      data: {
        submissionId,
        jobListing: {
          title: jobListing.title,
          company: jobListing.company,
          location: jobListing.location,
          aiResistanceScore: jobListing.aiResistanceScore,
          estimatedReviewTime: '1-2 business days'
        },
        nextSteps: [
          'Your job posting is now in our review queue',
          'We review all postings to ensure they meet our AI-resistance criteria',
          'You will receive an email confirmation within 1-2 business days',
          'Approved jobs will be live on the platform within 24 hours of approval'
        ]
      }
    })

  } catch (error) {
    console.error('Error in employer job posting:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit job posting',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to show posting guidelines and requirements
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Employer Job Posting API',
    guidelines: {
      aiResistanceCriteria: [
        'Jobs should require human creativity, empathy, or physical skills',
        'Positions involving complex problem-solving in unpredictable environments',
        'Roles requiring face-to-face human interaction',
        'Jobs with hands-on technical skills that can\'t be easily automated'
      ],
      preferredCategories: [
        'Healthcare & Medical',
        'Skilled Trades',
        'Education & Training',
        'Creative Arts',
        'Human Services',
        'Emergency Services',
        'Personal Care Services'
      ],
      reviewProcess: [
        'All job postings are reviewed within 1-2 business days',
        'Jobs are scored on AI-resistance (1-10 scale)',
        'Only jobs with score 6+ are typically approved',
        'Feedback provided for rejected postings',
        'Approved jobs go live within 24 hours'
      ],
      pricing: {
        basic: {
          price: 0,
          duration: '30 days',
          features: ['Basic listing', 'AI-resistance scoring', 'Email support']
        },
        featured: {
          price: 99,
          duration: '30 days',
          features: ['Featured placement', 'Social media promotion', 'Priority review', 'Analytics']
        },
        premium: {
          price: 199,
          duration: '60 days',
          features: ['Top placement', 'Dedicated support', 'Custom branding', 'Candidate matching']
        }
      }
    },
    requiredFields: [
      'companyName', 'companyEmail', 'jobTitle', 'jobDescription',
      'location', 'experienceLevel', 'category', 'contactPerson'
    ],
    examplePosting: {
      companyName: 'HealthFirst Medical',
      companyEmail: 'hiring@healthfirst.com',
      companyWebsite: 'https://healthfirst.com',
      companySize: 'medium',
      jobTitle: 'Registered Nurse - ICU',
      jobDescription: 'Join our ICU team providing critical care to patients...',
      requirements: ['RN License', 'BSN preferred', '2+ years ICU experience'],
      responsibilities: ['Patient assessment', 'Medication administration', 'Family communication'],
      location: 'San Francisco, CA',
      isRemote: false,
      employmentType: 'full-time',
      salaryMin: 85000,
      salaryMax: 110000,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      benefits: ['Health insurance', 'Dental', '401k', 'PTO'],
      experienceLevel: 'mid',
      requiredSkills: ['Patient care', 'Critical thinking', 'Communication'],
      preferredSkills: ['ACLS certification', 'Epic experience'],
      education: ['BSN in Nursing'],
      certifications: ['RN License', 'BLS'],
      applicationEmail: 'jobs@healthfirst.com',
      category: 'Healthcare',
      contactPerson: 'Sarah Johnson, Nurse Manager'
    }
  })
}

function calculateJobAIResistance(title: string, description: string, skills: string[]): number {
  const text = `${title} ${description} ${skills.join(' ')}`.toLowerCase()
  let score = 5 // Base score

  // High AI resistance indicators
  const highResistanceKeywords = [
    'patient care', 'hands-on', 'physical', 'creative', 'leadership',
    'emergency', 'installation', 'repair', 'counseling', 'teaching',
    'therapy', 'nursing', 'medical', 'skilled trade', 'craftsmanship'
  ]

  // Low AI resistance indicators
  const lowResistanceKeywords = [
    'data entry', 'administrative', 'clerical', 'routine', 'automated',
    'repetitive', 'processing', 'basic computer', 'filing', 'typing'
  ]

  // Bonus for healthcare, trades, education
  const bonusCategories = ['healthcare', 'medical', 'nurse', 'teacher', 'electrician', 'plumber']

  highResistanceKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 1.5
  })

  lowResistanceKeywords.forEach(keyword => {
    if (text.includes(keyword)) score -= 2
  })

  bonusCategories.forEach(keyword => {
    if (text.includes(keyword)) score += 1
  })

  return Math.max(1, Math.min(10, Math.round(score)))
}

async function sendEmployerConfirmationEmail(
  email: string, 
  details: { companyName: string; jobTitle: string; submissionId: string; aiResistanceScore: number }
) {
  // This would integrate with your email service
  console.log(`Sending confirmation email to ${email}:`, details)
  
  // Example email content:
  const emailContent = `
    Dear ${details.companyName},
    
    Thank you for submitting your job posting for "${details.jobTitle}" to Irreplaceable.
    
    Submission ID: ${details.submissionId}
    AI-Resistance Score: ${details.aiResistanceScore}/10
    
    Your job posting is now under review. We will notify you within 1-2 business days
    regarding the approval status.
    
    Best regards,
    The Irreplaceable Team
  `
  
  // Here you would use your email service (SendGrid, AWS SES, etc.)
  return Promise.resolve()
}

async function notifyAdminNewJobPosting(posting: any) {
  // This would notify your admin team
  console.log('New job posting for admin review:', {
    company: posting.companyName,
    title: posting.jobTitle,
    aiScore: posting.aiResistanceScore,
    submissionId: posting.submissionId
  })
  
  // Here you would send to Slack, email, or your admin dashboard
  return Promise.resolve()
}