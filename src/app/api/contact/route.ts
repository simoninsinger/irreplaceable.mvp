import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, category, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Store contact submission in database
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        category: category || 'general',
        message,
        createdAt: new Date()
      }
    })

    // In a real application, you would:
    // 1. Send an email to your support team
    // 2. Send a confirmation email to the user
    // 3. Add to a support ticket system
    // 4. Send notifications via Slack/Discord etc.

    // For now, we'll just log it
    console.log('New contact submission:', {
      name,
      email,
      subject,
      category,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message. We\'ll get back to you within 24 hours!' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while submitting your message. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API is working' },
    { status: 200 }
  )
}