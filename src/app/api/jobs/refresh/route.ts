import { NextRequest, NextResponse } from 'next/server'
import { JobAggregator, AI_RESISTANT_QUERIES } from '@/lib/job-scrapers'
import { AdzunaAPI, JobListing } from '@/lib/job-apis'

// This endpoint refreshes job data from all sources
// Can be called by Vercel Cron or external services
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 })
    }

    const startTime = Date.now()
    let totalJobsFetched = 0
    const jobSources: string[] = []

    // Initialize job aggregator
    const jobAggregator = new JobAggregator()
    const enabledSources = jobAggregator.getEnabledSources()

    console.log(`Starting job refresh from sources: ${enabledSources.join(', ')}`)

    // Fetch fresh jobs from all sources
    const allJobs: JobListing[] = []

    try {
      // Get jobs from aggregated sources (JSearch, APILayer, etc.)
      const aggregatedJobs = await jobAggregator.aggregateJobs(
        AI_RESISTANT_QUERIES.slice(0, 8), // Use 8 queries for better coverage
        'United States'
      )
      
      allJobs.push(...aggregatedJobs)
      totalJobsFetched += aggregatedJobs.length
      jobSources.push(...enabledSources)

      console.log(`Fetched ${aggregatedJobs.length} jobs from aggregated sources`)
    } catch (error) {
      console.error('Error fetching from aggregated sources:', error)
    }

    // Also fetch from Adzuna if available
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      try {
        const adzunaAPI = new AdzunaAPI(
          process.env.ADZUNA_APP_ID,
          process.env.ADZUNA_APP_KEY
        )

        jobSources.push('Adzuna')

        // Fetch from multiple AI-resistant job categories
        const adzunaQueries = [
          'registered nurse',
          'physical therapist', 
          'electrician technician',
          'teacher instructor',
          'chef cook',
          'plumber maintenance',
          'counselor social worker',
          'dental hygienist'
        ]

        for (const query of adzunaQueries) {
          try {
            const jobs = await adzunaAPI.searchJobs(query, 'us', 1, 30)
            const highQualityJobs = jobs.filter(job => 
              job.aiResistanceScore >= 6 && 
              job.salary && 
              job.description.length > 100
            )
            
            allJobs.push(...highQualityJobs)
            totalJobsFetched += highQualityJobs.length

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 800))
          } catch (error) {
            console.error(`Error fetching Adzuna jobs for "${query}":`, error)
          }
        }
      } catch (error) {
        console.error('Error with Adzuna API:', error)
      }
    }

    // Remove duplicates and sort by quality
    const uniqueJobs = removeDuplicateJobs(allJobs)
    const highQualityJobs = uniqueJobs
      .filter(job => job.aiResistanceScore >= 6)
      .sort((a, b) => {
        // Sort by AI resistance score, then by salary, then by recency
        if (a.aiResistanceScore !== b.aiResistanceScore) {
          return b.aiResistanceScore - a.aiResistanceScore
        }
        
        const aSalary = a.salary?.min || 0
        const bSalary = b.salary?.min || 0
        if (aSalary !== bSalary) {
          return bSalary - aSalary
        }
        
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      })

    // Here you would typically save to a database
    // For now, we'll just return the stats
    const refreshStats = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalJobsFetched,
        uniqueJobs: uniqueJobs.length,
        highQualityJobs: highQualityJobs.length,
        sources: jobSources,
        averageAIResistance: calculateAverageScore(highQualityJobs),
        processingTimeMs: Date.now() - startTime
      },
      topJobs: highQualityJobs.slice(0, 5).map(job => ({
        title: job.title,
        company: job.company,
        location: job.location,
        aiResistanceScore: job.aiResistanceScore,
        salary: job.salary,
        source: job.source
      }))
    }

    console.log('Job refresh completed:', refreshStats.stats)

    return NextResponse.json(refreshStats)

  } catch (error) {
    console.error('Error in job refresh:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Job refresh failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET endpoint to check refresh status
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Job refresh endpoint is active',
    availableSources: {
      adzuna: !!process.env.ADZUNA_APP_ID,
      jsearch: !!process.env.JSEARCH_API_KEY,
      apilayer: !!process.env.APILAYER_API_KEY
    },
    lastRefresh: new Date().toISOString()
  })
}

function removeDuplicateJobs(jobs: JobListing[]): JobListing[] {
  const seen = new Map<string, JobListing>()
  
  for (const job of jobs) {
    const key = `${job.title.toLowerCase().trim()}_${job.company.toLowerCase().trim()}`
    
    // Keep the job with the highest AI resistance score
    if (!seen.has(key) || seen.get(key)!.aiResistanceScore < job.aiResistanceScore) {
      seen.set(key, job)
    }
  }
  
  return Array.from(seen.values())
}

function calculateAverageScore(jobs: JobListing[]): number {
  if (jobs.length === 0) return 0
  
  const totalScore = jobs.reduce((sum, job) => sum + job.aiResistanceScore, 0)
  return Math.round((totalScore / jobs.length) * 100) / 100
}