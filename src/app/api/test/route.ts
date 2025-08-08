import { NextRequest, NextResponse } from 'next/server'

// Simple test endpoint to verify API routes are working
export async function GET(request: NextRequest) {
  try {
    const envVars = {
      ADZUNA_APP_ID: process.env.ADZUNA_APP_ID ? 'Set' : 'Missing',
      ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY ? 'Set' : 'Missing', 
      JSEARCH_API_KEY: process.env.JSEARCH_API_KEY ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not Set'
    }

    return NextResponse.json({
      success: true,
      message: 'API routes are working!',
      timestamp: new Date().toISOString(),
      environment: envVars,
      vercelRegion: process.env.VERCEL_REGION || 'unknown'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}