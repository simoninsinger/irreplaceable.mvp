"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home, Mail, ArrowLeft } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-gray-600">
            We encountered an unexpected error. Don&apos;t worry - we&apos;re on it!
          </p>
        </div>

        {/* Error Details (in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6 text-left">
            <h3 className="font-semibold text-red-900 mb-3">Error Details (Development)</h3>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => reset()}
            className="w-full bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="bg-white border-2 border-gray-400 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* What Happened */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">What happened?</h3>
          <div className="space-y-3 text-sm text-gray-700 text-left">
            <p>• A temporary technical issue occurred while processing your request</p>
            <p>• This could be due to high server load or a temporary service disruption</p>
            <p>• Our team has been automatically notified and is working to resolve this</p>
            <p>• Your data and account information remain safe and secure</p>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-4">What you can do:</h3>
          <div className="space-y-2 text-sm text-blue-800 text-left">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Click "Try Again" above to retry the action</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Wait a few minutes and try again</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Clear your browser cache and cookies</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Try using a different browser or device</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 hover:underline">
              Browse Jobs
            </Link>
            <Link href="/assessment" className="text-blue-600 hover:text-blue-700 hover:underline">
              Take Assessment
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 hover:underline">
              Dashboard
            </Link>
            <Link href="/learn" className="text-blue-600 hover:text-blue-700 hover:underline">
              Learning Center
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Mail className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-900">Still experiencing issues?</span>
          </div>
          <p className="text-sm text-red-800 mb-2">
            If this error persists, please contact our support team:
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Email:</strong>{" "}
              <a 
                href={`mailto:support@irreplaceable.careers?subject=Error Report&body=Error ID: ${error.digest || 'N/A'}%0AError Message: ${encodeURIComponent(error.message)}%0APage: ${encodeURIComponent(window.location.href)}`}
                className="text-red-700 underline hover:no-underline"
              >
                support@irreplaceable.careers
              </a>
            </p>
            <p className="text-red-700">
              <strong>Response time:</strong> Within 24 hours
            </p>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            Even the most AI-resistant careers face occasional technical glitches! 
            We&apos;ll have you back to building your irreplaceable future in no time. 💪
          </p>
        </div>
      </div>
    </div>
  )
}