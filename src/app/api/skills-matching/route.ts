import { NextRequest, NextResponse } from 'next/server'
import { JobListing, SEED_JOBS } from '@/lib/job-apis'

// In-memory storage for demo (in production, use database)
let userSkillProfiles: UserSkillProfile[] = []

interface UserSkillProfile {
  email: string
  skills: Skill[]
  preferences: {
    location: string
    remoteWork: boolean
    salaryMin: number
    categories: string[]
  }
  createdAt: Date
  updatedAt: Date
}

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
  yearsExperience?: number
}

interface SkillMatch {
  job: JobListing
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
}

// Common skills by category
const SKILL_CATEGORIES = {
  'Healthcare': [
    'Patient Care', 'Clinical Skills', 'Medical Documentation', 'EMR Systems', 
    'Vital Signs', 'Medication Administration', 'IV Therapy', 'Wound Care',
    'CPR/BLS', 'ACLS', 'Communication', 'Critical Thinking'
  ],
  'Skilled Trades': [
    'Electrical Systems', 'Plumbing', 'HVAC', 'Carpentry', 'Welding',
    'Construction', 'Blueprint Reading', 'Safety Protocols', 'Tool Operation',
    'Problem Solving', 'Physical Strength', 'Manual Dexterity'
  ],
  'Education': [
    'Curriculum Development', 'Classroom Management', 'Lesson Planning', 
    'Student Assessment', 'Educational Technology', 'Child Development',
    'Special Education', 'Parent Communication', 'Differentiated Instruction',
    'Behavior Management', 'Public Speaking', 'Patience'
  ],
  'Creative Arts': [
    'Graphic Design', 'Adobe Creative Suite', 'Photography', 'Video Editing',
    'Content Creation', 'Brand Strategy', 'Color Theory', 'Typography',
    'Digital Marketing', 'Social Media', 'Creative Writing', 'Art Direction'
  ],
  'Human Services': [
    'Counseling', 'Active Listening', 'Case Management', 'Crisis Intervention',
    'Social Work', 'Community Outreach', 'Mental Health', 'Conflict Resolution',
    'Documentation', 'Empathy', 'Cultural Competency', 'Advocacy'
  ],
  'Personal Services': [
    'Customer Service', 'Interpersonal Skills', 'Time Management', 
    'Attention to Detail', 'Manual Dexterity', 'Physical Stamina',
    'Sales', 'Consultation', 'Product Knowledge', 'Sanitation',
    'Equipment Operation', 'Scheduling'
  ]
}

// Calculate skill match score
function calculateSkillMatch(userSkills: Skill[], jobSkills: string[]): {
  score: number
  matched: string[]
  missing: string[]
} {
  const userSkillNames = userSkills.map(s => s.name.toLowerCase())
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase())
  
  const matched = jobSkillsLower.filter(skill => 
    userSkillNames.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  )
  
  const missing = jobSkillsLower.filter(skill => !matched.includes(skill))
  
  const score = jobSkillsLower.length > 0 ? (matched.length / jobSkillsLower.length) * 100 : 0
  
  return { score, matched, missing }
}

// Generate recommendations based on missing skills
function generateRecommendations(missingSkills: string[], jobCategory: string): string[] {
  const recommendations: string[] = []
  
  missingSkills.forEach(skill => {
    switch (skill.toLowerCase()) {
      case 'patient care':
        recommendations.push('Consider volunteering at hospitals or care facilities')
        break
      case 'clinical skills':
        recommendations.push('Look into certified nursing assistant (CNA) programs')
        break
      case 'electrical systems':
        recommendations.push('Take electrical fundamentals courses at community college')
        break
      case 'plumbing':
        recommendations.push('Consider apprenticeship programs with local plumbers')
        break
      case 'classroom management':
        recommendations.push('Substitute teaching can provide classroom experience')
        break
      case 'adobe creative suite':
        recommendations.push('Online tutorials and certification programs available')
        break
      default:
        recommendations.push(`Consider taking courses or gaining experience in ${skill}`)
    }
  })
  
  return recommendations.slice(0, 3) // Limit to 3 recommendations
}

// GET - Get skill-based job matches for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email parameter required'
      }, { status: 400 })
    }

    // Find user's skill profile
    const userProfile = userSkillProfiles.find(profile => 
      profile.email.toLowerCase() === email.toLowerCase()
    )

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        message: 'User skill profile not found. Please create a profile first.'
      }, { status: 404 })
    }

    // Get all available jobs (in production, this would query your job database)
    let availableJobs = [...SEED_JOBS]

    // Filter by user preferences
    if (userProfile.preferences.categories.length > 0) {
      availableJobs = availableJobs.filter(job =>
        userProfile.preferences.categories.some(cat =>
          job.category.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }

    if (userProfile.preferences.salaryMin > 0) {
      availableJobs = availableJobs.filter(job =>
        job.salary && job.salary.min && job.salary.min >= userProfile.preferences.salaryMin
      )
    }

    if (!userProfile.preferences.remoteWork) {
      availableJobs = availableJobs.filter(job => !job.remote)
    }

    // Calculate skill matches
    const skillMatches: SkillMatch[] = availableJobs.map(job => {
      const jobSkills = [...job.tags, ...job.requirements.slice(0, 3)]
      const { score, matched, missing } = calculateSkillMatch(userProfile.skills, jobSkills)
      const recommendations = generateRecommendations(missing, job.category)

      return {
        job,
        matchScore: score,
        matchedSkills: matched,
        missingSkills: missing,
        recommendations
      }
    })

    // Sort by match score (highest first)
    skillMatches.sort((a, b) => b.matchScore - a.matchScore)

    // Limit results
    const limitedMatches = skillMatches.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        matches: limitedMatches,
        totalMatches: skillMatches.length,
        userProfile: {
          skillCount: userProfile.skills.length,
          preferences: userProfile.preferences
        }
      }
    })

  } catch (error) {
    console.error('Error getting skill-based matches:', error)
    return NextResponse.json({
      success: false,
      message: 'Error getting skill-based matches'
    }, { status: 500 })
  }
}

// POST - Create or update user skill profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, skills, preferences } = body

    // Validation
    if (!email || !skills || !preferences) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, skills, preferences'
      }, { status: 400 })
    }

    // Find existing profile or create new one
    const existingIndex = userSkillProfiles.findIndex(profile => 
      profile.email.toLowerCase() === email.toLowerCase()
    )

    const profileData: UserSkillProfile = {
      email: email.toLowerCase(),
      skills,
      preferences,
      createdAt: existingIndex >= 0 ? userSkillProfiles[existingIndex].createdAt : new Date(),
      updatedAt: new Date()
    }

    if (existingIndex >= 0) {
      userSkillProfiles[existingIndex] = profileData
    } else {
      userSkillProfiles.push(profileData)
    }

    return NextResponse.json({
      success: true,
      data: profileData,
      message: 'Skill profile saved successfully'
    }, { status: existingIndex >= 0 ? 200 : 201 })

  } catch (error) {
    console.error('Error saving skill profile:', error)
    return NextResponse.json({
      success: false,
      message: 'Error saving skill profile'
    }, { status: 500 })
  }
}

// PUT - Get available skills by category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { category } = body

    if (category && SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES]) {
      return NextResponse.json({
        success: true,
        data: {
          category,
          skills: SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES]
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: Object.keys(SKILL_CATEGORIES),
        allSkills: SKILL_CATEGORIES
      }
    })

  } catch (error) {
    console.error('Error getting skills data:', error)
    return NextResponse.json({
      success: false,
      message: 'Error getting skills data'
    }, { status: 500 })
  }
}