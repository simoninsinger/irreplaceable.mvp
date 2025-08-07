import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, birthYear, subscribeNewsletter } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !birthYear) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate age requirement (16+)
    const currentYear = new Date().getFullYear()
    const age = currentYear - parseInt(birthYear)
    if (age < 16) {
      return NextResponse.json(
        { message: "You must be at least 16 years old to create an account" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (without email verification initially)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        birthYear: parseInt(birthYear),
        ageVerified: true, // Since we validated above
        subscribeNewsletter: subscribeNewsletter || false,
        emailVerified: null, // Email not verified yet
        profile: {
          create: {
            location: "",
            bio: "",
            experience: "entry_level",
            skills: "[]",
            interests: "[]",
            careerGoals: "[]"
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email.toLowerCase(), firstName, token)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email sending fails
      // User can resend verification later
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "Account created successfully! Please check your email to verify your account.",
        user: userWithoutPassword,
        emailSent: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}