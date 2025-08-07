"use client"

import { useState } from "react"
import { 
  Mail,
  CheckCircle,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Lightbulb,
  Calendar,
  Star,
  Award,
  Sparkles
} from "lucide-react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const careerCategories = [
    "Healthcare & Wellness",
    "Skilled Trades",
    "Creative Arts", 
    "Human Services",
    "Education & Training",
    "Sales & Relations",
    "Leadership & Management",
    "Entrepreneurship"
  ]

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

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
          interests,
          source: 'newsletter_page'
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to the Irreplaceable Community!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for subscribing! You&apos;ll receive your first newsletter with AI-resistant career insights within the next week.
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-gray-600 text-left">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Weekly career tips and job opportunities</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>AI-resistance industry updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Success stories from the community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span>Exclusive learning resources</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-medium"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stay Ahead of the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Revolution
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get weekly insights on AI-resistant careers, job opportunities, and strategies to future-proof your professional life.
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5,000+</div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-600">Found it Helpful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Weekly</div>
              <div className="text-sm text-gray-600">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Career Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Career Interests (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Select the career categories you&apos;re most interested in to receive personalized content:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {careerCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interests.includes(category)}
                      onChange={() => handleInterestToggle(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                What you&apos;ll get every week:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>AI-resistance career analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Market trend insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Success stories & case studies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Skill development tips</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Exclusive job opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Industry event updates</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Join the Community</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </form>
        </div>

        {/* Sample Newsletter Preview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h3 className="text-white font-semibold">📧 Latest: AI-Resistant Careers Weekly</h3>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-gray-900 mb-3">🔥 This Week: Healthcare Jobs Surge 40%</h4>
            <p className="text-gray-600 mb-4">
              Physical therapy and mental health roles are seeing unprecedented demand as people seek human-centered care...
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span><strong>Success Story:</strong> Sarah transitions from office work to art therapy</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span><strong>Trend Alert:</strong> Skilled trades salaries up 15% nationwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span><strong>Job Spotlight:</strong> 50+ physical therapist positions in Colorado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-3 italic">
              &ldquo;The newsletter helped me discover physical therapy as a career path. I&apos;m now in my first year of DPT school!&rdquo;
            </p>
            <p className="text-sm font-medium text-gray-900">- Maria Rodriguez</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-3 italic">
              &ldquo;Amazing insights on which careers are truly safe from AI. Changed my whole approach to job searching.&rdquo;
            </p>
            <p className="text-sm font-medium text-gray-900">- David Chen</p>
          </div>
        </div>
      </div>
    </div>
  )
}