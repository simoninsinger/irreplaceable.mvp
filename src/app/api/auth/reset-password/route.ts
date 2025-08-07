import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// POST - Request password reset (send email)
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
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration attacks
    // Don't reveal whether the email exists or not
    const successMessage = 'If an account with that email exists, we\'ve sent you a password reset link.'

    if (!user) {
      return NextResponse.json(
        { success: true, message: successMessage },
        { status: 200 }
      )
    }

    // Check if user has a password (might be social login only)
    if (!user.password) {
      // For social login users, we might want to handle this differently
      // For now, still send the "success" message to prevent enumeration
      return NextResponse.json(
        { success: true, message: successMessage },
        { status: 200 }
      )
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiration

    // Delete any existing password reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `password-reset:${email.toLowerCase()}`
      }
    })

    // Store password reset token
    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${email.toLowerCase()}`,
        token: resetToken,
        expires
      }
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(
        email.toLowerCase(), 
        user.firstName || 'User',
        resetToken
      )
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't reveal email sending failure to prevent enumeration
      // Log the error but return success to user
    }

    return NextResponse.json(
      { success: true, message: successMessage },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// PATCH - Reset password with token
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { success: false, message: 'Reset token has expired. Please request a new password reset.' },
        { status: 400 }
      )
    }

    // Verify this is a password reset token
    if (!resetToken.identifier.startsWith('password-reset:')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token type' },
        { status: 400 }
      )
    }

    // Extract email from identifier
    const email = resetToken.identifier.replace('password-reset:', '')

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        // Update emailVerified if not already verified (password reset implies email verification)
        emailVerified: user.emailVerified || new Date()
      }
    })

    // Delete the used reset token
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Delete any other password reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `password-reset:${email}`
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password has been reset successfully. You can now sign in with your new password.' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset confirmation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while resetting your password. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// GET - Verify reset token (check if token is valid)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      })
      
      return NextResponse.json(
        { success: false, message: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Verify this is a password reset token
    if (!resetToken.identifier.startsWith('password-reset:')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token type' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Token is valid',
        email: resetToken.identifier.replace('password-reset:', '')
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while verifying the token' 
      },
      { status: 500 }
    )
  }
}