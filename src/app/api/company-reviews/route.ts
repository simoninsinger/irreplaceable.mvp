import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (in production, use database)
let companyReviews: CompanyReview[] = []
let companies: Company[] = []

interface CompanyReview {
  id: string
  companyName: string
  reviewerEmail: string
  reviewerName: string
  jobTitle: string
  employmentType: 'current' | 'former'
  overallRating: number
  ratings: {
    workLifeBalance: number
    compensation: number
    culture: number
    management: number
    careerGrowth: number
    jobSecurity: number
  }
  pros: string
  cons: string
  advice: string
  wouldRecommend: boolean
  createdAt: Date
  verified: boolean
  helpful: number
  notHelpful: number
}

interface Company {
  name: string
  industry: string
  size: string
  location: string
  website?: string
  description?: string
  averageRatings: {
    overall: number
    workLifeBalance: number
    compensation: number
    culture: number
    management: number
    careerGrowth: number
    jobSecurity: number
  }
  totalReviews: number
  wouldRecommendPercentage: number
}

// Seed some initial data
if (companies.length === 0) {
  companies = [
    {
      name: "Metro General Hospital",
      industry: "Healthcare",
      size: "1000-5000",
      location: "New York, NY",
      website: "https://metrogeneralhospital.com",
      description: "Leading healthcare provider in the NYC area",
      averageRatings: {
        overall: 4.2,
        workLifeBalance: 3.8,
        compensation: 4.1,
        culture: 4.3,
        management: 3.9,
        careerGrowth: 4.0,
        jobSecurity: 4.5
      },
      totalReviews: 127,
      wouldRecommendPercentage: 84
    },
    {
      name: "Bright Future Electric",
      industry: "Construction & Skilled Trades",
      size: "50-200",
      location: "Austin, TX",
      website: "https://brightfutureelectric.com",
      description: "Electrical contracting services across Texas",
      averageRatings: {
        overall: 4.4,
        workLifeBalance: 4.2,
        compensation: 4.3,
        culture: 4.1,
        management: 4.2,
        careerGrowth: 4.0,
        jobSecurity: 4.6
      },
      totalReviews: 43,
      wouldRecommendPercentage: 91
    },
    {
      name: "Sunshine Elementary",
      industry: "Education",
      size: "200-500",
      location: "Denver, CO",
      website: "https://sunshineelementary.edu",
      description: "Public elementary school serving grades K-5",
      averageRatings: {
        overall: 3.9,
        workLifeBalance: 3.5,
        compensation: 3.2,
        culture: 4.4,
        management: 3.8,
        careerGrowth: 3.6,
        jobSecurity: 4.3
      },
      totalReviews: 28,
      wouldRecommendPercentage: 75
    }
  ]

  // Add some sample reviews
  companyReviews = [
    {
      id: "review_1",
      companyName: "Metro General Hospital",
      reviewerEmail: "nurse@example.com",
      reviewerName: "Sarah M.",
      jobTitle: "Registered Nurse",
      employmentType: "current",
      overallRating: 4,
      ratings: {
        workLifeBalance: 4,
        compensation: 4,
        culture: 5,
        management: 4,
        careerGrowth: 4,
        jobSecurity: 5
      },
      pros: "Great team environment, excellent benefits, opportunities for continuing education. The hospital really supports its nursing staff.",
      cons: "Can be stressful during peak times, some outdated equipment in certain departments.",
      advice: "Come prepared to learn constantly. The medical field is always evolving and this hospital encourages growth.",
      wouldRecommend: true,
      createdAt: new Date('2024-10-15'),
      verified: true,
      helpful: 23,
      notHelpful: 2
    },
    {
      id: "review_2",
      companyName: "Bright Future Electric",
      reviewerEmail: "electrician@example.com",
      reviewerName: "Mike R.",
      jobTitle: "Journeyman Electrician",
      employmentType: "current",
      overallRating: 5,
      ratings: {
        workLifeBalance: 4,
        compensation: 5,
        culture: 4,
        management: 5,
        careerGrowth: 4,
        jobSecurity: 5
      },
      pros: "Excellent pay, great benefits, management actually cares about workers. Lots of variety in projects from residential to commercial.",
      cons: "Weather can be tough in Texas summers, some travel required for bigger projects.",
      advice: "If you're getting into the electrical trade, this is a great company to start with. They invest in their people.",
      wouldRecommend: true,
      createdAt: new Date('2024-09-22'),
      verified: true,
      helpful: 18,
      notHelpful: 1
    }
  ]
}

// GET - Get company reviews and ratings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyName = searchParams.get('company')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (companyName) {
      // Get specific company data and reviews
      const company = companies.find(c => 
        c.name.toLowerCase() === companyName.toLowerCase()
      )

      if (!company) {
        return NextResponse.json({
          success: false,
          message: 'Company not found'
        }, { status: 404 })
      }

      const reviews = companyReviews
        .filter(review => review.companyName.toLowerCase() === companyName.toLowerCase())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)

      return NextResponse.json({
        success: true,
        data: {
          company,
          reviews,
          reviewCount: reviews.length
        }
      })
    } else {
      // Get all companies with basic info
      return NextResponse.json({
        success: true,
        data: {
          companies: companies.map(company => ({
            name: company.name,
            industry: company.industry,
            averageRatings: company.averageRatings,
            totalReviews: company.totalReviews,
            wouldRecommendPercentage: company.wouldRecommendPercentage
          }))
        }
      })
    }

  } catch (error) {
    console.error('Error retrieving company reviews:', error)
    return NextResponse.json({
      success: false,
      message: 'Error retrieving company reviews'
    }, { status: 500 })
  }
}

// POST - Create new company review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      companyName, 
      reviewerEmail, 
      reviewerName, 
      jobTitle, 
      employmentType,
      overallRating,
      ratings,
      pros,
      cons,
      advice,
      wouldRecommend
    } = body

    // Validation
    if (!companyName || !reviewerEmail || !reviewerName || !jobTitle || !overallRating) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    if (overallRating < 1 || overallRating > 5) {
      return NextResponse.json({
        success: false,
        message: 'Overall rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Check if user has already reviewed this company
    const existingReview = companyReviews.find(review => 
      review.companyName.toLowerCase() === companyName.toLowerCase() &&
      review.reviewerEmail.toLowerCase() === reviewerEmail.toLowerCase()
    )

    if (existingReview) {
      return NextResponse.json({
        success: false,
        message: 'You have already reviewed this company'
      }, { status: 400 })
    }

    const newReview: CompanyReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName,
      reviewerEmail: reviewerEmail.toLowerCase(),
      reviewerName,
      jobTitle,
      employmentType: employmentType || 'former',
      overallRating,
      ratings: ratings || {
        workLifeBalance: overallRating,
        compensation: overallRating,
        culture: overallRating,
        management: overallRating,
        careerGrowth: overallRating,
        jobSecurity: overallRating
      },
      pros: pros || '',
      cons: cons || '',
      advice: advice || '',
      wouldRecommend: wouldRecommend !== false,
      createdAt: new Date(),
      verified: false, // Would be verified through email in production
      helpful: 0,
      notHelpful: 0
    }

    companyReviews.push(newReview)

    // Update or create company record
    let company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase())
    if (!company) {
      company = {
        name: companyName,
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown',
        averageRatings: {
          overall: overallRating,
          workLifeBalance: ratings?.workLifeBalance || overallRating,
          compensation: ratings?.compensation || overallRating,
          culture: ratings?.culture || overallRating,
          management: ratings?.management || overallRating,
          careerGrowth: ratings?.careerGrowth || overallRating,
          jobSecurity: ratings?.jobSecurity || overallRating
        },
        totalReviews: 1,
        wouldRecommendPercentage: wouldRecommend ? 100 : 0
      }
      companies.push(company)
    } else {
      // Recalculate averages
      const companyReviewsList = companyReviews.filter(r => 
        r.companyName.toLowerCase() === companyName.toLowerCase()
      )
      
      const totalReviews = companyReviewsList.length
      const avgOverall = companyReviewsList.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews
      const avgWorkLife = companyReviewsList.reduce((sum, r) => sum + r.ratings.workLifeBalance, 0) / totalReviews
      const avgCompensation = companyReviewsList.reduce((sum, r) => sum + r.ratings.compensation, 0) / totalReviews
      const avgCulture = companyReviewsList.reduce((sum, r) => sum + r.ratings.culture, 0) / totalReviews
      const avgManagement = companyReviewsList.reduce((sum, r) => sum + r.ratings.management, 0) / totalReviews
      const avgCareerGrowth = companyReviewsList.reduce((sum, r) => sum + r.ratings.careerGrowth, 0) / totalReviews
      const avgJobSecurity = companyReviewsList.reduce((sum, r) => sum + r.ratings.jobSecurity, 0) / totalReviews
      const recommendPercentage = (companyReviewsList.filter(r => r.wouldRecommend).length / totalReviews) * 100

      company.averageRatings = {
        overall: Math.round(avgOverall * 10) / 10,
        workLifeBalance: Math.round(avgWorkLife * 10) / 10,
        compensation: Math.round(avgCompensation * 10) / 10,
        culture: Math.round(avgCulture * 10) / 10,
        management: Math.round(avgManagement * 10) / 10,
        careerGrowth: Math.round(avgCareerGrowth * 10) / 10,
        jobSecurity: Math.round(avgJobSecurity * 10) / 10
      }
      company.totalReviews = totalReviews
      company.wouldRecommendPercentage = Math.round(recommendPercentage)
    }

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating company review:', error)
    return NextResponse.json({
      success: false,
      message: 'Error creating company review'
    }, { status: 500 })
  }
}

// PATCH - Mark review as helpful/not helpful
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId, helpful } = body

    if (!reviewId || helpful === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Review ID and helpful status required'
      }, { status: 400 })
    }

    const reviewIndex = companyReviews.findIndex(review => review.id === reviewId)
    
    if (reviewIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Review not found'
      }, { status: 404 })
    }

    if (helpful) {
      companyReviews[reviewIndex].helpful++
    } else {
      companyReviews[reviewIndex].notHelpful++
    }

    return NextResponse.json({
      success: true,
      data: companyReviews[reviewIndex],
      message: 'Review feedback recorded'
    })

  } catch (error) {
    console.error('Error updating review feedback:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating review feedback'
    }, { status: 500 })
  }
}