import { NextRequest, NextResponse } from 'next/server'
import { JobAggregator } from '@/lib/job-scrapers'
import { AdzunaAPI } from '@/lib/job-apis'

// Debug endpoint to test API connections
export async function GET() {
  try {
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: {
        adzunaAppId: process.env.ADZUNA_APP_ID ? 'Set' : 'Missing',
        adzunaAppKey: process.env.ADZUNA_APP_KEY ? 'Set' : 'Missing',
        jsearchKey: process.env.JSEARCH_API_KEY ? 'Set' : 'Missing',
        apilayerKey: process.env.APILAYER_API_KEY ? 'Set' : 'Missing'
      },
      tests: {}
    }

    // Test JobAggregator
    const aggregator = new JobAggregator()
    debugInfo.aggregator = {
      enabledSources: aggregator.getEnabledSources(),
      sourceCount: aggregator.getEnabledSources().length
    }

    // Test Adzuna API
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      try {
        const adzunaAPI = new AdzunaAPI(
          process.env.ADZUNA_APP_ID,
          process.env.ADZUNA_APP_KEY
        )
        
        console.log('Testing Adzuna API...')
        const adzunaJobs = await adzunaAPI.searchJobs('nurse', 'us', 1, 5)
        debugInfo.tests.adzuna = {
          status: 'success',
          jobCount: adzunaJobs.length,
          sampleJob: adzunaJobs[0] ? {
            title: adzunaJobs[0].title,
            company: adzunaJobs[0].company,
            source: adzunaJobs[0].source
          } : null
        }
      } catch (error) {
        debugInfo.tests.adzuna = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else {
      debugInfo.tests.adzuna = {
        status: 'skipped',
        reason: 'Missing credentials'
      }
    }

    // Test JSearch API through aggregator
    if (aggregator.getEnabledSources().includes('JSearch')) {
      try {
        console.log('Testing job aggregator...')
        const aggregatedJobs = await aggregator.aggregateJobs(['nurse'], 'United States')
        debugInfo.tests.aggregator = {
          status: 'success',
          jobCount: aggregatedJobs.length,
          sampleJob: aggregatedJobs[0] ? {
            title: aggregatedJobs[0].title,
            company: aggregatedJobs[0].company,
            source: aggregatedJobs[0].source
          } : null
        }
      } catch (error) {
        debugInfo.tests.aggregator = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else {
      debugInfo.tests.aggregator = {
        status: 'skipped',
        reason: 'No enabled sources'
      }
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}