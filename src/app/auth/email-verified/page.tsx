import Link from "next/link"
import { CheckCircle, ArrowRight, Mail, TrendingUp } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email Verified Successfully | Irreplaceable",
  description: "Your email has been verified successfully. Welcome to Irreplaceable! Start building your AI-resistant career today.",
  robots: "noindex, nofollow", // Don't index this page
}

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Verified! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to the Irreplaceable community!
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Email Verified</h3>
                <p className="text-sm text-gray-600">Your email address has been successfully verified</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Account Activated</h3>
                <p className="text-sm text-gray-600">You now have full access to all platform features</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Notifications Enabled</h3>
                <p className="text-sm text-gray-600">You'll receive important updates and job alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-4">🚀 Ready to get started?</h3>
          <p className="text-blue-800 text-sm mb-4">
            Now that your email is verified, you can take full advantage of everything Irreplaceable has to offer!
          </p>
          
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Discover your ideal AI-resistant career</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Browse hundreds of future-proof job opportunities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Get personalized job alerts and career insights</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/assessment"
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Take Career Assessment</span>
          </Link>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/jobs"
              className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Browse Jobs</span>
            </Link>
            <Link
              href="/dashboard"
              className="bg-white border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <span>My Dashboard</span>
            </Link>
          </div>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Welcome Note */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <p className="text-sm">
            <strong>🛡️ Irreplaceable Promise:</strong> We'll help you build a career that celebrates your uniquely human skills and stays valuable in the AI economy.
          </p>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Questions? We're here to help!{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}