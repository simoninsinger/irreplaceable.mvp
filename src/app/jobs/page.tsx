"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Shield, 
  Filter,
  Heart,
  ExternalLink,
  Award,
  Users,
  Building,
  Loader2,
  Calculator,
  X
} from "lucide-react"
import { JobListing } from "@/lib/job-apis"


const categories = [
  "All Categories",
  "Healthcare", 
  "Skilled Trades",
  "Creative Arts",
  "Human Services",
  "Education",
  "Sales & Relations",
  "Leadership & Management",
  "Other"
]

const experienceLevels = ["All Experience", "entry", "mid", "senior", "executive"]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedExperience, setSelectedExperience] = useState("All Experience")
  const [minAIResistance, setMinAIResistance] = useState("6")
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJobBenefits, setSelectedJobBenefits] = useState<JobListing | null>(null)

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs()
  }, [searchTerm, location, selectedCategory, selectedExperience, minAIResistance, currentPage])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { q: searchTerm }),
        ...(location && { location: location }),
        ...(selectedCategory !== "All Categories" && { category: selectedCategory }),
        ...(selectedExperience !== "All Experience" && { experience: selectedExperience }),
        aiResistance: minAIResistance
      })

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.data.jobs)
        setTotalJobs(data.data.total)
      } else {
        console.error('Error fetching jobs:', data.message)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getResistanceBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const formatSalary = (salary?: { min?: number; max?: number; currency: string; period: string }) => {
    if (!salary) return 'Salary not listed'
    const { min, max, currency, period } = salary
    const formatAmount = (amount: number) => {
      if (period === 'yearly') return `$${(amount / 1000).toFixed(0)}k`
      if (period === 'hourly') return `$${amount}/hr`
      return `$${amount}`
    }
    
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`
    }
    if (min) return `${formatAmount(min)}+`
    return 'Salary not listed'
  }

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case 'entry': return 'Entry Level'
      case 'mid': return 'Mid Level'
      case 'senior': return 'Senior Level'
      case 'executive': return 'Executive'
      default: return level
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your AI-Resistant Career
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover jobs that leverage uniquely human skills - creativity, empathy, and complex problem-solving that AI cannot replace.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location (city, state, remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min AI Resistance</label>
                  <select
                    value={minAIResistance}
                    onChange={(e) => setMinAIResistance(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Any Level (1+)</option>
                    <option value="6">Medium (6+)</option>
                    <option value="8">High (8+)</option>
                    <option value="9">Very High (9+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading AI-resistant jobs...
              </span>
            ) : (
              <span>Found <span className="font-semibold">{totalJobs}</span> AI-resistant jobs</span>
            )}
          </p>
        </div>

        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getResistanceBadgeColor(job.aiResistanceScore)}`}>
                      <Shield className="inline h-3 w-3 mr-1" />
                      {job.aiResistanceScore}/10 AI-Resistance
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatSalary(job.salary)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getExperienceLabel(job.experience)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {job.category}
                    </span>
                    {job.remote && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-2">
                        Remote
                      </span>
                    )}
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full ml-2">
                      {job.source}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-full transition-colors ${
                    savedJobs.includes(job.id)
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              {job.tags.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">AI-Resistant Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 5).map((tag, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Apply Now</span>
                </a>
                <div className="flex space-x-2">
                  {job.benefits.length > 0 && (
                    <button 
                      onClick={() => setSelectedJobBenefits(job)}
                      className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                    >
                      Benefits ({job.benefits.length})
                    </button>
                  )}
                  <Link
                    href={`/roi-calculator?career=${job.category.toLowerCase().replace(/\s+/g, '_')}`}
                    className="px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 font-medium flex items-center space-x-1"
                  >
                    <Calculator className="h-4 w-4" />
                    <span>ROI</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Modal */}
        {selectedJobBenefits && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Benefits & Perks
                  </h2>
                  <button
                    onClick={() => setSelectedJobBenefits(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedJobBenefits.title} at {selectedJobBenefits.company}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedJobBenefits.location}</span>
                    <span>•</span>
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(selectedJobBenefits.salary)}</span>
                  </div>
                </div>

                {selectedJobBenefits.benefits.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Available Benefits:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedJobBenefits.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-800 font-medium capitalize">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-4">
                      <Award className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-lg font-medium mb-2">Benefits Information Not Available</p>
                    <p className="text-sm">Contact the employer directly to learn about their benefits package.</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="flex space-x-3">
                    <a
                      href={selectedJobBenefits.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Apply for This Position</span>
                    </a>
                    <Link
                      href={`/roi-calculator?career=${selectedJobBenefits.category.toLowerCase().replace(/\s+/g, '_')}`}
                      className="px-4 py-3 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 font-medium flex items-center space-x-2"
                    >
                      <Calculator className="h-4 w-4" />
                      <span>ROI Calculator</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all categories.</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setLocation("")
                setSelectedCategory("All Categories")
                setMinAIResistance("6")
                setSelectedExperience("All Experience")
                setCurrentPage(1)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}