'use client'

import Link from "next/link"
import { Home, Search, ArrowLeft, HelpCircle, Mail } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Error Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-200">404</h1>
          <div className="relative -mt-4">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Oops! The page you&apos;re looking for seems to have wandered off into the digital wilderness. 
            Don&apos;t worry - even the best career paths have a few detours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Return Home</span>
          </Link>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/jobs"
              className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Find Jobs</span>
            </Link>
            <Link
              href="/assessment"
              className="bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Take Assessment</span>
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link href="/about" className="text-blue-600 hover:text-blue-700 hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
              Contact Support
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
              Terms of Service
            </Link>
            <Link href="/learn" className="text-blue-600 hover:text-blue-700 hover:underline">
              Learning Center
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Still need help?</span>
          </div>
          <p className="text-sm text-blue-800">
            Contact our support team at{" "}
            <a 
              href="mailto:support@irreplaceable.careers" 
              className="font-medium underline hover:no-underline"
            >
              support@irreplaceable.careers
            </a>
          </p>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 italic">
            Fun fact: While you&apos;re here, remember that your career path doesn&apos;t have to be perfectly linear either. 
            Sometimes the best opportunities come from unexpected detours! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}