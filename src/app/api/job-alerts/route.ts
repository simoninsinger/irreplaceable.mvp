import { NextRequest, NextResponse } from 'next/server'
import { JobListing } from '@/lib/job-apis'

// In-memory storage for demo (in production, use database)
let jobAlerts: JobAlert[] = []

interface JobAlert {
  id: string
  email: string
  keywords: string[]
  location?: string
  minSalary?: number
  categories: string[]
  minAIResistance: number
  frequency: 'daily' | 'weekly' | 'instant'
  active: boolean
  createdAt: Date
  lastSent?: Date
}

// GET - Retrieve job alerts for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email parameter required'
      }, { status: 400 })
    }

    const userAlerts = jobAlerts.filter(alert => 
      alert.email.toLowerCase() === email.toLowerCase()
    )

    return NextResponse.json({
      success: true,
      data: userAlerts,
      count: userAlerts.length
    })

  } catch (error) {
    console.error('Error retrieving job alerts:', error)
    return NextResponse.json({
      success: false,
      message: 'Error retrieving job alerts'
    }, { status: 500 })
  }
}

// POST - Create new job alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      keywords, 
      location, 
      minSalary, 
      categories, 
      minAIResistance, 
      frequency 
    } = body

    // Validation
    if (!email || !keywords || !categories || !frequency) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, keywords, categories, frequency'
      }, { status: 400 })
    }

    if (!['daily', 'weekly', 'instant'].includes(frequency)) {
      return NextResponse.json({
        success: false,
        message: 'Frequency must be daily, weekly, or instant'
      }, { status: 400 })
    }

    const newAlert: JobAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      location,
      minSalary: minSalary ? parseInt(minSalary) : undefined,
      categories: Array.isArray(categories) ? categories : [categories],
      minAIResistance: minAIResistance || 6,
      frequency,
      active: true,
      createdAt: new Date()
    }

    jobAlerts.push(newAlert)

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: 'Job alert created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating job alert:', error)
    return NextResponse.json({
      success: false,
      message: 'Error creating job alert'
    }, { status: 500 })
  }
}

// DELETE - Remove job alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')
    const email = searchParams.get('email')

    if (!alertId || !email) {
      return NextResponse.json({
        success: false,
        message: 'Alert ID and email required'
      }, { status: 400 })
    }

    const alertIndex = jobAlerts.findIndex(alert => 
      alert.id === alertId && alert.email.toLowerCase() === email.toLowerCase()
    )

    if (alertIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Job alert not found'
      }, { status: 404 })
    }

    jobAlerts.splice(alertIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Job alert deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting job alert:', error)
    return NextResponse.json({
      success: false,
      message: 'Error deleting job alert'
    }, { status: 500 })
  }
}

// PATCH - Update job alert status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, email, active } = body

    if (!alertId || !email || active === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Alert ID, email, and active status required'
      }, { status: 400 })
    }

    const alertIndex = jobAlerts.findIndex(alert => 
      alert.id === alertId && alert.email.toLowerCase() === email.toLowerCase()
    )

    if (alertIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Job alert not found'
      }, { status: 404 })
    }

    jobAlerts[alertIndex].active = active

    return NextResponse.json({
      success: true,
      data: jobAlerts[alertIndex],
      message: `Job alert ${active ? 'activated' : 'deactivated'} successfully`
    })

  } catch (error) {
    console.error('Error updating job alert:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating job alert'
    }, { status: 500 })
  }
}