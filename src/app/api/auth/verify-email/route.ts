import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    // Send verification email
    await sendVerificationEmail(email, user.firstName || 'User', token)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification sending error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send verification email. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// Handle email verification confirmation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { success: false, message: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Update user email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date()
      }
    })

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/email-verified', request.url))
  } catch (error) {
    console.error('Email verification confirmation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify email. Please try again.' 
      },
      { status: 500 }
    )
  }
}