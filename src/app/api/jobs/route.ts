import { NextRequest, NextResponse } from 'next/server'
import { AdzunaAPI, SEED_JOBS, AI_RESISTANT_KEYWORDS, JobListing } from '@/lib/job-apis'
import { JobAggregator, AI_RESISTANT_QUERIES } from '@/lib/job-scrapers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'nurse electrician teacher therapist'
    const location = searchParams.get('location') || 'us'
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const remote = searchParams.get('remote')
    const experience = searchParams.get('experience')
    const minSalary = searchParams.get('minSalary')
    const aiResistance = searchParams.get('aiResistance')

    let jobs: JobListing[] = []

    // Always include seed jobs for immediate content
    jobs = [...SEED_JOBS]

    // Initialize job aggregator for multiple sources
    const jobAggregator = new JobAggregator()
    
    try {
      // Use specific query or default AI-resistant queries
      const searchQueries = query && query !== 'nurse electrician teacher therapist' 
        ? [query] 
        : AI_RESISTANT_QUERIES.slice(0, 6) // Use first 6 queries to avoid rate limits

      console.log(`Fetching jobs from sources: ${jobAggregator.getEnabledSources().join(', ')}`)
      
      // Fetch from all enabled sources
      const aggregatedJobs = await jobAggregator.aggregateJobs(searchQueries, location)
      jobs.push(...aggregatedJobs)

      // Also try Adzuna API if credentials are available
      if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
        try {
          const adzunaAPI = new AdzunaAPI(
            process.env.ADZUNA_APP_ID,
            process.env.ADZUNA_APP_KEY
          )

          for (const searchQuery of searchQueries.slice(0, 3)) { // Limit to 3 queries
            try {
              const apiJobs = await adzunaAPI.searchJobs(searchQuery, location, 1, 25)
              const filteredJobs = apiJobs.filter(job => job.aiResistanceScore >= 6)
              jobs.push(...filteredJobs)
              
              await new Promise(resolve => setTimeout(resolve, 600))
            } catch (error) {
              console.error(`Error fetching from Adzuna for query "${searchQuery}":`, error)
            }
          }
        } catch (error) {
          console.error('Error initializing Adzuna API:', error)
        }
      }
    } catch (error) {
      console.error('Error in job aggregation:', error)
    }

    // Apply filters
    let filteredJobs = jobs

    if (category) {
      filteredJobs = filteredJobs.filter(job => 
        job.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (remote) {
      const isRemote = remote === 'true'
      filteredJobs = filteredJobs.filter(job => job.remote === isRemote)
    }

    if (experience) {
      filteredJobs = filteredJobs.filter(job => job.experience === experience)
    }

    if (minSalary) {
      const minSal = parseInt(minSalary)
      filteredJobs = filteredJobs.filter(job => 
        job.salary && job.salary.min && job.salary.min >= minSal
      )
    }

    if (aiResistance) {
      const minAIResistance = parseInt(aiResistance)
      filteredJobs = filteredJobs.filter(job => job.aiResistanceScore >= minAIResistance)
    }

    // Text search filter
    if (query && query !== 'nurse electrician teacher therapist') {
      const queryLower = query.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(queryLower) ||
        job.company.toLowerCase().includes(queryLower) ||
        job.description.toLowerCase().includes(queryLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
    }

    // Remove duplicates based on title + company
    const uniqueJobs = filteredJobs.filter((job, index, self) =>
      index === self.findIndex(j => j.title === job.title && j.company === job.company)
    )

    // Sort by AI resistance score (highest first), then by posted date
    uniqueJobs.sort((a, b) => {
      if (a.aiResistanceScore !== b.aiResistanceScore) {
        return b.aiResistanceScore - a.aiResistanceScore
      }
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    })

    // Pagination
    const pageSize = 20
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = uniqueJobs.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        total: uniqueJobs.length,
        page,
        pageSize,
        totalPages: Math.ceil(uniqueJobs.length / pageSize),
        hasMore: endIndex < uniqueJobs.length
      },
      message: `Found ${uniqueJobs.length} AI-resistant jobs`
    })

  } catch (error) {
    console.error('Error in jobs API:', error)
    
    // Return seed jobs as fallback
    return NextResponse.json({
      success: true,
      data: {
        jobs: SEED_JOBS,
        total: SEED_JOBS.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasMore: false
      },
      message: 'Showing curated AI-resistant jobs'
    })
  }
}

// POST endpoint for job recommendations based on assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessmentResults, preferences } = body

    if (!assessmentResults) {
      return NextResponse.json({
        success: false,
        message: 'Assessment results required'
      }, { status: 400 })
    }

    // Simple recommendation logic based on assessment scores
    let recommendedCategories: string[] = []

    // Map assessment answers to job categories
    if (assessmentResults.workStyle === 'people') {
      recommendedCategories.push('Healthcare', 'Education', 'Human Services')
    }
    if (assessmentResults.workStyle === 'hands-on') {
      recommendedCategories.push('Skilled Trades', 'Healthcare', 'Engineering')
    }
    if (assessmentResults.workStyle === 'creative') {
      recommendedCategories.push('Creative Arts', 'Marketing', 'Design')
    }

    // Filter jobs based on recommended categories
    let recommendedJobs = SEED_JOBS.filter(job =>
      recommendedCategories.some(category => 
        job.category.toLowerCase().includes(category.toLowerCase())
      )
    )

    // If no category matches, return high AI-resistance jobs
    if (recommendedJobs.length === 0) {
      recommendedJobs = SEED_JOBS.filter(job => job.aiResistanceScore >= 8)
    }

    return NextResponse.json({
      success: true,
      data: {
        jobs: recommendedJobs,
        recommendedCategories,
        total: recommendedJobs.length
      },
      message: 'Job recommendations based on your assessment'
    })

  } catch (error) {
    console.error('Error in job recommendations:', error)
    return NextResponse.json({
      success: false,
      message: 'Error generating job recommendations'
    }, { status: 500 })
  }
}