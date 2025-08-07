"use client"

import { useState } from "react"
import { Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { trackNewsletterSignup } from "@/components/analytics"

interface NewsletterSignupProps {
  variant?: "inline" | "modal" | "sidebar"
  showBenefits?: boolean
  title?: string
  description?: string
}

export function NewsletterSignup({ 
  variant = "inline", 
  showBenefits = true,
  title = "Stay Ahead of AI",
  description = "Get weekly insights on AI-resistant careers and job opportunities."
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'homepage'
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
        // Track successful newsletter signup
        trackNewsletterSignup('homepage')
        // Reset after 3 seconds
        setTimeout(() => {
          setIsSubscribed(false)
          setEmail("")
        }, 3000)
      } else {
        const data = await response.json()
        alert(data.message || 'Subscription failed. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className={`text-center ${variant === 'inline' ? 'py-8' : 'p-6'}`}>
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-green-900 mb-2">Successfully Subscribed!</h3>
        <p className="text-sm text-green-700">
          Check your email for a welcome message and your first AI-resistant career insights.
        </p>
      </div>
    )
  }

  const baseClasses = variant === 'sidebar' 
    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6"
    : variant === 'modal'
    ? "bg-white rounded-lg shadow-lg p-6 border"
    : "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8"

  return (
    <div className={baseClasses}>
      <div className="text-center mb-6">
        {variant === 'sidebar' ? (
          <Mail className="h-8 w-8 mx-auto mb-3 text-blue-100" />
        ) : (
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
        )}
        <h3 className={`text-xl font-bold mb-2 ${
          variant === 'sidebar' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          variant === 'sidebar' ? 'text-blue-100' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>

      {showBenefits && variant !== 'sidebar' && (
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">Weekly career insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">Job opportunities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">Success stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">Market trends</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            variant === 'sidebar'
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className={`text-xs text-center mt-3 ${
        variant === 'sidebar' ? 'text-blue-100' : 'text-gray-500'
      }`}>
        No spam, ever. Unsubscribe at any time.
      </p>

      {variant === 'inline' && (
        <div className="mt-4 text-center">
          <a 
            href="/newsletter" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Learn more about our newsletter →
          </a>
        </div>
      )}
    </div>
  )
}