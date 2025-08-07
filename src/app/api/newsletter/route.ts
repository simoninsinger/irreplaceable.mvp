import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, interests = [], source = "website" } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return NextResponse.json(
          { message: "This email is already subscribed to our newsletter" },
          { status: 400 }
        )
      } else {
        // Reactivate existing subscriber
        await prisma.newsletter.update({
          where: { email: email.toLowerCase() },
          data: { 
            active: true,
            interests: Array.isArray(interests) ? interests.join(',') : '',
            source
          }
        })

        return NextResponse.json(
          { 
            message: "Successfully reactivated your newsletter subscription!",
            email: email.toLowerCase()
          },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        interests: Array.isArray(interests) ? interests.join(',') : '',
        source,
        active: true
      }
    })

    // In a real app, you might want to:
    // - Send a welcome email
    // - Add to your email marketing platform (SendGrid, Mailchimp, etc.)
    // - Set up email verification

    return NextResponse.json(
      { 
        message: "Successfully subscribed to newsletter!",
        email: subscriber.email
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get newsletter stats (for admin dashboard later)
    const totalSubscribers = await prisma.newsletter.count({
      where: { active: true }
    })

    const recentSubscribers = await prisma.newsletter.count({
      where: {
        active: true,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })

    const subscribersBySource = await prisma.newsletter.groupBy({
      by: ['source'],
      where: { active: true },
      _count: {
        _all: true
      }
    })

    return NextResponse.json({
      totalSubscribers,
      recentSubscribers,
      subscribersBySource
    })

  } catch (error) {
    console.error("Newsletter stats error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}