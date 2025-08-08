import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (in production, use database)
let referrals: Referral[] = []
let referralCodes: ReferralCode[] = []

interface Referral {
  id: string
  referrerEmail: string
  referredEmail: string
  referredName: string
  status: 'pending' | 'registered' | 'completed'
  referralCode: string
  createdAt: Date
  completedAt?: Date
  reward?: number
}

interface ReferralCode {
  code: string
  email: string
  uses: number
  maxUses: number
  createdAt: Date
  active: boolean
}

// Generate unique referral code
function generateReferralCode(email: string): string {
  const emailPrefix = email.split('@')[0].substring(0, 3).toUpperCase()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${emailPrefix}${randomSuffix}`
}

// GET - Get user's referral data
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

    // Get or create referral code for user
    let userCode = referralCodes.find(code => code.email === email.toLowerCase())
    if (!userCode) {
      const newCode = {
        code: generateReferralCode(email),
        email: email.toLowerCase(),
        uses: 0,
        maxUses: 50,
        createdAt: new Date(),
        active: true
      }
      referralCodes.push(newCode)
      userCode = newCode
    }

    // Get user's referrals
    const userReferrals = referrals.filter(ref => 
      ref.referrerEmail.toLowerCase() === email.toLowerCase()
    )

    // Calculate stats
    const totalReferrals = userReferrals.length
    const completedReferrals = userReferrals.filter(ref => ref.status === 'completed').length
    const pendingReferrals = userReferrals.filter(ref => ref.status === 'pending').length
    const totalRewards = userReferrals.reduce((sum, ref) => sum + (ref.reward || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        referralCode: userCode.code,
        stats: {
          totalReferrals,
          completedReferrals,
          pendingReferrals,
          totalRewards,
          codeUses: userCode.uses,
          maxUses: userCode.maxUses
        },
        referrals: userReferrals
      }
    })

  } catch (error) {
    console.error('Error retrieving referral data:', error)
    return NextResponse.json({
      success: false,
      message: 'Error retrieving referral data'
    }, { status: 500 })
  }
}

// POST - Create new referral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referrerEmail, referredEmail, referredName, referralCode } = body

    // Validation
    if (!referrerEmail || !referredEmail || !referredName) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: referrerEmail, referredEmail, referredName'
      }, { status: 400 })
    }

    // Check if already referred
    const existingReferral = referrals.find(ref => 
      ref.referredEmail.toLowerCase() === referredEmail.toLowerCase()
    )

    if (existingReferral) {
      return NextResponse.json({
        success: false,
        message: 'This person has already been referred'
      }, { status: 400 })
    }

    // Validate referral code if provided
    let validReferralCode = referralCode
    if (referralCode) {
      const codeData = referralCodes.find(code => 
        code.code === referralCode && code.active && code.uses < code.maxUses
      )
      if (!codeData) {
        return NextResponse.json({
          success: false,
          message: 'Invalid or expired referral code'
        }, { status: 400 })
      }
    } else {
      // Generate new referral code for this referral
      validReferralCode = generateReferralCode(referrerEmail)
    }

    const newReferral: Referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referrerEmail: referrerEmail.toLowerCase(),
      referredEmail: referredEmail.toLowerCase(),
      referredName,
      status: 'pending',
      referralCode: validReferralCode,
      createdAt: new Date()
    }

    referrals.push(newReferral)

    // Update code usage
    const codeData = referralCodes.find(code => code.code === validReferralCode)
    if (codeData) {
      codeData.uses++
    }

    return NextResponse.json({
      success: true,
      data: newReferral,
      message: 'Referral created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating referral:', error)
    return NextResponse.json({
      success: false,
      message: 'Error creating referral'
    }, { status: 500 })
  }
}

// PATCH - Update referral status (for when referred user registers/completes)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralId, status, email } = body

    if (!referralId || !status) {
      return NextResponse.json({
        success: false,
        message: 'Referral ID and status required'
      }, { status: 400 })
    }

    const referralIndex = referrals.findIndex(ref => 
      ref.id === referralId || 
      (email && ref.referredEmail.toLowerCase() === email.toLowerCase())
    )

    if (referralIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Referral not found'
      }, { status: 404 })
    }

    referrals[referralIndex].status = status

    // Award rewards for completed referrals
    if (status === 'completed') {
      referrals[referralIndex].completedAt = new Date()
      referrals[referralIndex].reward = 50 // $50 reward
    }

    return NextResponse.json({
      success: true,
      data: referrals[referralIndex],
      message: `Referral status updated to ${status}`
    })

  } catch (error) {
    console.error('Error updating referral:', error)
    return NextResponse.json({
      success: false,
      message: 'Error updating referral'
    }, { status: 500 })
  }
}

// Validate referral code endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json({
        success: false,
        message: 'Referral code required'
      }, { status: 400 })
    }

    const codeData = referralCodes.find(code => 
      code.code === referralCode && code.active
    )

    if (!codeData) {
      return NextResponse.json({
        success: false,
        message: 'Invalid referral code',
        valid: false
      })
    }

    if (codeData.uses >= codeData.maxUses) {
      return NextResponse.json({
        success: false,
        message: 'Referral code has reached maximum uses',
        valid: false
      })
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        code: codeData.code,
        remainingUses: codeData.maxUses - codeData.uses
      },
      message: 'Valid referral code'
    })

  } catch (error) {
    console.error('Error validating referral code:', error)
    return NextResponse.json({
      success: false,
      message: 'Error validating referral code'
    }, { status: 500 })
  }
}