"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  GraduationCap,
  Shield,
  Users,
  Award,
  ChevronRight,
  Briefcase,
  Target,
  BookOpen,
  Loader2
} from "lucide-react"
import { CareerPath } from "@/lib/job-apis"

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerPath[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [minSalary, setMinSalary] = useState("")
  const [minAIResistance, setMinAIResistance] = useState("6")
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null)

  const industries = [
    "All Industries",
    "Healthcare",
    "Construction", 
    "Education",
    "Creative Arts",
    "Manufacturing",
    "Personal Services",
    "Emergency Services"
  ]

  useEffect(() => {
    fetchCareers()
  }, [searchTerm, selectedIndustry, minSalary, minAIResistance])

  const fetchCareers = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(searchTerm && { q: searchTerm }),
        ...(selectedIndustry !== "All Industries" && { industry: selectedIndustry }),
        ...(minSalary && { salaryMin: minSalary }),
        aiResistance: minAIResistance
      })

      const response = await fetch(`/api/careers?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setCareers(data.data.careers)
      }
    } catch (error) {
      console.error('Error fetching careers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGrowthColor = (outlook: string) => {
    switch (outlook) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'  
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getResistanceBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Explore AI-Resistant Career Paths
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover careers that leverage uniquely human skills and have strong growth potential in an AI-driven world.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search careers, skills, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                <select
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Salary</option>
                  <option value="40000">$40k+</option>
                  <option value="60000">$60k+</option>
                  <option value="80000">$80k+</option>
                  <option value="100000">$100k+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Resistance</label>
                <select
                  value={minAIResistance}
                  onChange={(e) => setMinAIResistance(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Any Level (1+)</option>
                  <option value="6">Medium (6+)</option>
                  <option value="8">High (8+)</option>
                  <option value="9">Very High (9+)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading career paths...</span>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold">{careers.length}</span> AI-resistant career paths
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map(career => (
                <div 
                  key={career.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCareer(career)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{career.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getResistanceBadgeColor(career.aiResistanceScore)}`}>
                        <Shield className="inline h-3 w-3 mr-1" />
                        {career.aiResistanceScore}/10
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {career.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>${(career.averageSalary.min / 1000).toFixed(0)}k - ${(career.averageSalary.max / 1000).toFixed(0)}k</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(career.growthOutlook)}`}>
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                          {career.growthOutlook} growth
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        <span>{career.education[0]}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{career.industries.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {career.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {career.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{career.skills.length - 3} more</span>
                      )}
                    </div>

                    <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center space-x-2">
                      <span>Explore Career</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {careers.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No career paths found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedIndustry("All Industries")
                    setMinSalary("")
                    setMinAIResistance("6")
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.title}</h2>
                  <span className={`inline-block px-3 py-1 text-sm font-medium border rounded-full mt-2 ${getResistanceBadgeColor(selectedCareer.aiResistanceScore)}`}>
                    <Shield className="inline h-4 w-4 mr-1" />
                    {selectedCareer.aiResistanceScore}/10 AI-Resistance
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 mb-6">{selectedCareer.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Average Salary
                      </h4>
                      <p className="text-gray-600">
                        ${(selectedCareer.averageSalary.min / 1000).toFixed(0)}k - ${(selectedCareer.averageSalary.max / 1000).toFixed(0)}k per year
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Growth Outlook
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGrowthColor(selectedCareer.growthOutlook)}`}>
                        {selectedCareer.growthOutlook} growth expected
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Education Requirements
                      </h4>
                      <ul className="text-gray-600 space-y-1">
                        {selectedCareer.education.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Industries
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.industries.map((industry, index) => (
                          <span key={index} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedCareer.certifications && selectedCareer.certifications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Certifications
                        </h4>
                        <ul className="text-gray-600 space-y-1">
                          {selectedCareer.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Why AI-Resistant
                      </h4>
                      <ul className="text-gray-600 space-y-1">
                        {selectedCareer.whyAIResistant.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <Link
                    href={`/jobs?category=${selectedCareer.industries[0]}`}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium text-center"
                  >
                    Find Jobs in This Field
                  </Link>
                  <Link
                    href="/assessment"
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium text-center"
                  >
                    Take Career Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}