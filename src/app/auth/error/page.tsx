"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Shield, AlertCircle, ArrowLeft } from "lucide-react"

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description: "There is a problem with the server configuration. Please contact support if this continues."
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to sign in with this account."
  },
  Verification: {
    title: "Email Verification Required",
    description: "Please check your email and click the verification link to complete your account setup."
  },
  CredentialsSignin: {
    title: "Invalid Credentials",
    description: "The email or password you entered is incorrect. Please try again."
  },
  EmailCreateAccount: {
    title: "Account Creation Failed",
    description: "Could not create an account with this email address. It may already be in use."
  },
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description: "There was an error signing in with your social account. Please try again."
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "There was an error processing the sign in response. Please try again."
  },
  OAuthCreateAccount: {
    title: "OAuth Account Creation Failed",
    description: "Could not create an account with this social provider. Please try a different method."
  },
  EmailSignin: {
    title: "Email Sign In Error",
    description: "Could not send sign in email. Please check your email address and try again."
  },
  CallbackRouteError: {
    title: "Callback Route Error",
    description: "There was an error in the authentication callback. Please try signing in again."
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    description: "This account is already associated with a different sign in method. Please use your original sign in method."
  },
  SessionRequired: {
    title: "Sign In Required",
    description: "You must be signed in to access this page."
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred during authentication. Please try again."
  }
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"
  
  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Irreplaceable</span>
            </Link>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
              <p className="text-gray-600">{errorInfo.description}</p>
            </div>
          </div>

          {/* Error Details */}
          {error !== "Default" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Error Code: <span className="font-mono font-medium">{error}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium inline-block transition-colors"
            >
              Try Signing In Again
            </Link>
            
            <Link
              href="/auth/signup"
              className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 font-medium inline-block transition-colors"
            >
              Create New Account
            </Link>

            <Link
              href="/"
              className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 font-medium inline-flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Still having trouble?{" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}