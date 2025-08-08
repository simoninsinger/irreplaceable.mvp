import { NextRequest, NextResponse } from 'next/server'
import { AI_RESISTANT_CAREERS, CareerPath } from '@/lib/job-apis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const aiResistance = searchParams.get('aiResistance')
    const salaryMin = searchParams.get('salaryMin')
    const growthOutlook = searchParams.get('growthOutlook')
    const industry = searchParams.get('industry')

    let careers: CareerPath[] = [...AI_RESISTANT_CAREERS]

    // Apply filters
    if (query) {
      const queryLower = query.toLowerCase()
      careers = careers.filter(career =>
        career.title.toLowerCase().includes(queryLower) ||
        career.description.toLowerCase().includes(queryLower) ||
        career.skills.some(skill => skill.toLowerCase().includes(queryLower)) ||
        career.industries.some(ind => ind.toLowerCase().includes(queryLower))
      )
    }

    if (aiResistance) {
      const minResistance = parseInt(aiResistance)
      careers = careers.filter(career => career.aiResistanceScore >= minResistance)
    }

    if (salaryMin) {
      const minSalary = parseInt(salaryMin)
      careers = careers.filter(career => career.averageSalary.min >= minSalary)
    }

    if (growthOutlook) {
      careers = careers.filter(career => career.growthOutlook === growthOutlook)
    }

    if (industry) {
      careers = careers.filter(career =>
        career.industries.some(ind => ind.toLowerCase().includes(industry.toLowerCase()))
      )
    }

    // Sort by AI resistance score (highest first)
    careers.sort((a, b) => b.aiResistanceScore - a.aiResistanceScore)

    return NextResponse.json({
      success: true,
      data: {
        careers,
        total: careers.length
      },
      message: `Found ${careers.length} AI-resistant career paths`
    })

  } catch (error) {
    console.error('Error in careers API:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching career paths'
    }, { status: 500 })
  }
}

// Get detailed career information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { careerId } = body

    if (!careerId) {
      return NextResponse.json({
        success: false,
        message: 'Career ID required'
      }, { status: 400 })
    }

    const career = AI_RESISTANT_CAREERS.find(c => c.id === careerId)

    if (!career) {
      return NextResponse.json({
        success: false,
        message: 'Career not found'
      }, { status: 404 })
    }

    // Get related careers based on similar industries/skills
    const relatedCareers = AI_RESISTANT_CAREERS.filter(c => 
      c.id !== careerId && (
        c.industries.some(industry => career.industries.includes(industry)) ||
        c.skills.some(skill => career.skills.includes(skill))
      )
    ).slice(0, 3)

    return NextResponse.json({
      success: true,
      data: {
        career,
        relatedCareers
      }
    })

  } catch (error) {
    console.error('Error fetching career details:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching career details'
    }, { status: 500 })
  }
}