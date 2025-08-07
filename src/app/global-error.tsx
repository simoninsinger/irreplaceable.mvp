"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Critical Error
              </h1>
              <p className="text-lg text-gray-600">
                A critical error has occurred. We&apos;re working to fix this immediately.
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
                <span>Reload Application</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Go to Homepage</span>
              </button>
            </div>

            {/* What to Do */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What to do:</h3>
              <div className="space-y-2 text-sm text-gray-700 text-left">
                <p>• Try reloading the page</p>
                <p>• Clear your browser cache</p>
                <p>• Wait a few minutes and try again</p>
                <p>• Contact support if the issue persists</p>
              </div>
            </div>

            {/* Support Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-900 mb-2">Need immediate help?</p>
              <p className="text-sm text-red-800">
                Email us at{" "}
                <a 
                  href="mailto:support@irreplaceable.careers"
                  className="font-medium underline hover:no-underline"
                >
                  support@irreplaceable.careers
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}