"use client"

import { useState, useEffect } from "react"
import { 
  Building, 
  Star, 
  Users,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  BarChart3,
  X
} from "lucide-react"

interface Company {
  name: string
  industry: string
  size?: string
  location?: string
  website?: string
  description?: string
  averageRatings: {
    overall: number
    workLifeBalance: number
    compensation: number
    culture: number
    management: number
    careerGrowth: number
    jobSecurity: number
  }
  totalReviews: number
  wouldRecommendPercentage: number
}

interface CompanyReview {
  id: string
  companyName: string
  reviewerName: string
  jobTitle: string
  employmentType: 'current' | 'former'
  overallRating: number
  ratings: {
    workLifeBalance: number
    compensation: number
    culture: number
    management: number
    careerGrowth: number
    jobSecurity: number
  }
  pros: string
  cons: string
  advice: string
  wouldRecommend: boolean
  createdAt: string
  verified: boolean
  helpful: number
  notHelpful: number
}

export default function CompanyReviewsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyReviews, setCompanyReviews] = useState<CompanyReview[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    companyName: "",
    reviewerName: "",
    jobTitle: "",
    employmentType: "former" as const,
    overallRating: 5,
    ratings: {
      workLifeBalance: 5,
      compensation: 5,
      culture: 5,
      management: 5,
      careerGrowth: 5,
      jobSecurity: 5
    },
    pros: "",
    cons: "",
    advice: "",
    wouldRecommend: true
  })

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || ""
    setUserEmail(storedEmail)
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/company-reviews')
      const data = await response.json()
      
      if (data.success) {
        setCompanies(data.data.companies)
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCompanyReviews = async (companyName: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/company-reviews?company=${encodeURIComponent(companyName)}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedCompany(data.data.company)
        setCompanyReviews(data.data.reviews)
      }
    } catch (error) {
      console.error('Error loading company reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail) {
      setMessage("Please enter your email first")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/company-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...reviewForm,
          reviewerEmail: userEmail
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Review submitted successfully!")
        setShowReviewForm(false)
        setReviewForm({
          companyName: "",
          reviewerName: "",
          jobTitle: "",
          employmentType: "former",
          overallRating: 5,
          ratings: {
            workLifeBalance: 5,
            compensation: 5,
            culture: 5,
            management: 5,
            careerGrowth: 5,
            jobSecurity: 5
          },
          pros: "",
          cons: "",
          advice: "",
          wouldRecommend: true
        })
        loadCompanies()
        if (selectedCompany) {
          loadCompanyReviews(selectedCompany.name)
        }
      } else {
        setMessage(data.message || "Error submitting review")
      }
    } catch (error) {
      setMessage("Error submitting review")
    } finally {
      setIsLoading(false)
    }
  }

  const markHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await fetch('/api/company-reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviewId, helpful })
      })
      
      // Refresh reviews
      if (selectedCompany) {
        loadCompanyReviews(selectedCompany.name)
      }
    } catch (error) {
      console.error('Error marking review helpful:', error)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5', 
      lg: 'h-6 w-6'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-1 font-medium ${size === 'lg' ? 'text-lg' : 'text-sm'} text-gray-700`}>
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  const renderRatingBar = (label: string, rating: number) => (
    <div className="flex items-center space-x-3">
      <div className="w-24 text-sm text-gray-600 text-right">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
      <div className="w-8 text-sm font-medium text-gray-700">{rating.toFixed(1)}</div>
    </div>
  )

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Enter Your Email</h2>
            <p className="text-gray-600">We need your email to access company reviews</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const email = (e.target as any).email.value
            localStorage.setItem('userEmail', email)
            setUserEmail(email)
          }}>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Building className="h-8 w-8 mr-3 text-blue-600" />
                Company Reviews
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Read authentic reviews from employees in AI-resistant careers and share your own workplace experiences.
              </p>
            </div>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Write Review</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('Error') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center">
              {message.includes('Error') ? 
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" /> :
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              }
              <span className={message.includes('Error') ? 'text-red-800' : 'text-green-800'}>{message}</span>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Write a Company Review</h2>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={submitReview} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={reviewForm.companyName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Metro General Hospital"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        value={reviewForm.reviewerName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                        placeholder="John D."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={reviewForm.jobTitle}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="Registered Nurse"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                      <select
                        value={reviewForm.employmentType}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, employmentType: e.target.value as any }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="current">Current Employee</option>
                        <option value="former">Former Employee</option>
                      </select>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, overallRating: rating }))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= reviewForm.overallRating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Ratings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Rate Different Aspects</label>
                    <div className="space-y-4">
                      {Object.entries(reviewForm.ratings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize w-32">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewForm(prev => ({
                                  ...prev,
                                  ratings: { ...prev.ratings, [key]: rating }
                                }))}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    rating <= value 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Written Feedback */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
                      <textarea
                        value={reviewForm.pros}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, pros: e.target.value }))}
                        placeholder="What do you like about working here?"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
                      <textarea
                        value={reviewForm.cons}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, cons: e.target.value }))}
                        placeholder="What could be improved?"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Advice to Management</label>
                      <textarea
                        value={reviewForm.advice}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, advice: e.target.value }))}
                        placeholder="What advice would you give to management?"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reviewForm.wouldRecommend}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">I would recommend this company to a friend</span>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {!selectedCompany ? (
          // Companies List View
          <div>
            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading companies...</p>
                </div>
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <div
                    key={index}
                    onClick={() => loadCompanyReviews(company.name)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                      <div className="text-right">
                        {renderStars(company.averageRatings.overall)}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Work-Life Balance</span>
                        <span className="font-medium">{company.averageRatings.workLifeBalance.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compensation</span>
                        <span className="font-medium">{company.averageRatings.compensation.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Culture</span>
                        <span className="font-medium">{company.averageRatings.culture.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{company.totalReviews} reviews</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                        <span>{company.wouldRecommendPercentage}% recommend</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
                  <p className="text-gray-600">Try a different search term or browse all companies.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Company Detail View
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedCompany(null)}
              className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>← Back to Companies</span>
            </button>

            {/* Company Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCompany.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {selectedCompany.industry}
                    </span>
                    {selectedCompany.location && (
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedCompany.location}
                      </span>
                    )}
                    {selectedCompany.size && (
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedCompany.size} employees
                      </span>
                    )}
                    {selectedCompany.website && (
                      <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                  {selectedCompany.description && (
                    <p className="text-gray-700">{selectedCompany.description}</p>
                  )}
                </div>
                <div className="text-right">
                  {renderStars(selectedCompany.averageRatings.overall, 'lg')}
                  <p className="text-sm text-gray-600 mt-1">{selectedCompany.totalReviews} reviews</p>
                  <p className="text-sm text-green-600 font-medium">
                    {selectedCompany.wouldRecommendPercentage}% recommend
                  </p>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {renderRatingBar("Work-Life Balance", selectedCompany.averageRatings.workLifeBalance)}
                  {renderRatingBar("Compensation", selectedCompany.averageRatings.compensation)}
                  {renderRatingBar("Culture", selectedCompany.averageRatings.culture)}
                </div>
                <div className="space-y-3">
                  {renderRatingBar("Management", selectedCompany.averageRatings.management)}
                  {renderRatingBar("Career Growth", selectedCompany.averageRatings.careerGrowth)}
                  {renderRatingBar("Job Security", selectedCompany.averageRatings.jobSecurity)}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Employee Reviews ({companyReviews.length})
                </h2>
              </div>

              {companyReviews.length > 0 ? (
                companyReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          {renderStars(review.overallRating)}
                          <span className="text-sm text-gray-600">
                            {review.reviewerName} • {review.jobTitle}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.employmentType === 'current' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {review.employmentType === 'current' ? 'Current' : 'Former'} Employee
                          </span>
                          {review.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" title="Verified Review" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.wouldRecommend 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {review.wouldRecommend ? 'Recommends' : "Doesn't Recommend"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {review.pros && (
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Pros</h4>
                          <p className="text-gray-700">{review.pros}</p>
                        </div>
                      )}

                      {review.cons && (
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">Cons</h4>
                          <p className="text-gray-700">{review.cons}</p>
                        </div>
                      )}

                      {review.advice && (
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Advice to Management</h4>
                          <p className="text-gray-700">{review.advice}</p>
                        </div>
                      )}
                    </div>

                    {/* Helpfulness */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Was this review helpful?
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => markHelpful(review.id, true)}
                          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Yes ({review.helpful})</span>
                        </button>
                        <button
                          onClick={() => markHelpful(review.id, false)}
                          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>No ({review.notHelpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to review this company!</p>
                  <button
                    onClick={() => {
                      setReviewForm(prev => ({ ...prev, companyName: selectedCompany.name }))
                      setShowReviewForm(true)
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Write First Review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}