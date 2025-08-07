"use client"

import { useState } from "react"
import { Mail, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface EmailVerificationBannerProps {
  userEmail: string
  isVerified: boolean
  onDismiss?: () => void
}

export function EmailVerificationBanner({ 
  userEmail, 
  isVerified, 
  onDismiss 
}: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)
  const [resentSuccessfully, setResentSuccessfully] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show banner if email is already verified or if dismissed
  if (isVerified || isDismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      })

      if (response.ok) {
        setResentSuccessfully(true)
        setTimeout(() => setResentSuccessfully(false), 5000)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (resentSuccessfully) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Verification email sent!</p>
              <p className="text-sm text-green-700">
                Check your inbox at <strong>{userEmail}</strong> and click the verification link.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-600 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium text-yellow-900">Verify your email address</h3>
              <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Action Required
              </span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Please verify your email address <strong>{userEmail}</strong> to access all features and receive important updates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-yellow-700 hover:text-yellow-800 text-sm font-medium px-3 py-2 transition-colors"
              >
                Dismiss for now
              </button>
            </div>
            
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-yellow-600 hover:text-yellow-700 ml-3"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Help text */}
      <div className="mt-4 pt-3 border-t border-yellow-200">
        <p className="text-xs text-yellow-600">
          💡 <strong>Tip:</strong> Check your spam/junk folder if you don't see the email. 
          The verification link will expire in 24 hours for security.
        </p>
      </div>
    </div>
  )
}

// Compact version for use in navigation or smaller spaces
export function EmailVerificationAlert({ 
  userEmail, 
  isVerified 
}: Omit<EmailVerificationBannerProps, 'onDismiss'>) {
  const [isResending, setIsResending] = useState(false)

  if (isVerified) return null

  const handleResendVerification = async () => {
    setIsResending(true)
    
    try {
      await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      })
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <p className="text-sm text-red-700">
            <strong>Email not verified</strong> - Limited access
          </p>
        </div>
        <button
          onClick={handleResendVerification}
          disabled={isResending}
          className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {isResending ? 'Sending...' : 'Resend'}
        </button>
      </div>
    </div>
  )
}