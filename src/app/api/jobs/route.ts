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
    let apiJobsFound = 0

    // Initialize job aggregator for multiple sources
    const jobAggregator = new JobAggregator()
    const enabledSources = jobAggregator.getEnabledSources()
    
    console.log(`API Check - Enabled sources: ${enabledSources.join(', ')}`)
    console.log(`API Check - ADZUNA_APP_ID: ${process.env.ADZUNA_APP_ID ? 'Set' : 'Missing'}`)
    console.log(`API Check - JSEARCH_API_KEY: ${process.env.JSEARCH_API_KEY ? 'Set' : 'Missing'}`)
    
    // Use specific query or default AI-resistant queries
    const searchQueries = query && query !== 'nurse electrician teacher therapist' 
      ? [query] 
      : ['nurse', 'electrician', 'teacher'] // Simplified for testing

    try {
      // Fetch from JSearch and other aggregated sources first
      if (enabledSources.length > 0) {
        console.log(`Fetching from aggregated sources: ${enabledSources.join(', ')}`)
        const aggregatedJobs = await jobAggregator.aggregateJobs(searchQueries, 'United States')
        console.log(`Aggregated jobs found: ${aggregatedJobs.length}`)
        jobs.push(...aggregatedJobs)
        apiJobsFound += aggregatedJobs.length
      }

      // Then try Adzuna API
      if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
        console.log('Fetching from Adzuna API...')
        const adzunaAPI = new AdzunaAPI(
          process.env.ADZUNA_APP_ID,
          process.env.ADZUNA_APP_KEY
        )

        for (const searchQuery of searchQueries.slice(0, 2)) { // Limit to 2 queries for testing
          try {
            console.log(`Adzuna search: "${searchQuery}"`)
            const apiJobs = await adzunaAPI.searchJobs(searchQuery, location, 1, 20)
            console.log(`Adzuna found ${apiJobs.length} jobs for "${searchQuery}"`)
            
            const filteredJobs = apiJobs.filter(job => job.aiResistanceScore >= 6)
            console.log(`After AI filter: ${filteredJobs.length} jobs`)
            jobs.push(...filteredJobs)
            apiJobsFound += filteredJobs.length
            
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (error) {
            console.error(`Error fetching from Adzuna for query "${searchQuery}":`, error)
          }
        }
      }
    } catch (error) {
      console.error('Error in job aggregation:', error)
    }

    // Only add seed jobs if no API jobs were found
    if (apiJobsFound === 0) {
      console.log('No API jobs found, adding seed jobs as fallback')
      jobs = [...SEED_JOBS]
    } else {
      console.log(`Found ${apiJobsFound} API jobs, adding some seed jobs for variety`)
      jobs.push(...SEED_JOBS.slice(0, 2)) // Add just 2 seed jobs for variety
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
      debug: {
        apiJobsFound,
        enabledSources,
        totalAfterFilters: filteredJobs.length,
        uniqueAfterDedup: uniqueJobs.length
      },
      message: apiJobsFound > 0 
        ? `Found ${apiJobsFound} API jobs + ${SEED_JOBS.length} seed jobs` 
        : `Using ${SEED_JOBS.length} seed jobs (no API jobs found)`
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