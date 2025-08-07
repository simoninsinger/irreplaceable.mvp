"use client"

import { useState } from "react"
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
  Building
} from "lucide-react"

// Mock job data
const sampleJobs = [
  {
    id: "1",
    title: "Physical Therapist",
    company: "HealthFirst Rehabilitation",
    location: "San Francisco, CA",
    salary: "$85,000 - $110,000",
    experience: "2-5 years",
    category: "Healthcare & Wellness",
    aiResistance: "High",
    isRemote: false,
    description: "Help patients recover mobility and manage pain through personalized treatment plans. Requires human touch, empathy, and complex problem-solving.",
    requirements: ["DPT degree", "State license", "2+ years experience", "Strong communication skills"],
    whyAiResistant: "Requires physical manipulation, emotional support, and complex patient assessment that AI cannot replicate."
  },
  {
    id: "2", 
    title: "Master Electrician",
    company: "PowerPro Electric",
    location: "Austin, TX",
    salary: "$75,000 - $95,000",
    experience: "5+ years",
    category: "Skilled Trades",
    aiResistance: "High",
    isRemote: false,
    description: "Lead electrical installations and repairs in residential and commercial settings. Troubleshoot complex electrical systems and mentor apprentices.",
    requirements: ["Master Electrician License", "5+ years experience", "Blueprint reading", "Leadership skills"],
    whyAiResistant: "Hands-on problem solving in unpredictable environments requiring physical dexterity and real-time decision making."
  },
  {
    id: "3",
    title: "Art Therapist", 
    company: "Mindful Healing Center",
    location: "Portland, OR",
    salary: "$60,000 - $75,000",
    experience: "1-3 years",
    category: "Creative Arts",
    aiResistance: "High",
    isRemote: false,
    description: "Use creative arts to help clients express emotions and work through trauma. Combine artistic skills with psychological understanding.",
    requirements: ["Master's in Art Therapy", "State certification", "Portfolio of work", "Empathy and patience"],
    whyAiResistant: "Combines human creativity with emotional intelligence and therapeutic relationship building."
  },
  {
    id: "4",
    title: "Sales Manager - Medical Devices",
    company: "MedTech Solutions",
    location: "Chicago, IL", 
    salary: "$90,000 - $120,000",
    experience: "3-7 years",
    category: "Sales & Relations",
    aiResistance: "High",
    isRemote: true,
    description: "Build relationships with healthcare providers to introduce innovative medical devices. Requires deep product knowledge and trust-building.",
    requirements: ["Bachelor's degree", "Sales experience", "Healthcare industry knowledge", "Relationship building skills"],
    whyAiResistant: "Complex B2B relationships, emotional intelligence, and consultative selling require human connection."
  },
  {
    id: "5",
    title: "Preschool Teacher",
    company: "Little Learners Academy",
    location: "Denver, CO",
    salary: "$45,000 - $55,000", 
    experience: "0-2 years",
    category: "Education & Training",
    aiResistance: "High",
    isRemote: false,
    description: "Nurture young children's development through play-based learning. Create safe, engaging environments for ages 3-5.",
    requirements: ["ECE degree or certification", "Background check", "First aid certification", "Patience and creativity"],
    whyAiResistant: "Child development requires human warmth, adaptability to individual needs, and emotional nurturing."
  },
  {
    id: "6",
    title: "Plumbing Contractor",
    company: "AquaFix Plumbing",
    location: "Phoenix, AZ",
    salary: "$65,000 - $85,000",
    experience: "3-5 years", 
    category: "Skilled Trades",
    aiResistance: "High",
    isRemote: false,
    description: "Diagnose and repair complex plumbing systems. Handle emergency calls and customer service. Opportunity for business ownership.",
    requirements: ["Plumbing license", "3+ years experience", "Own tools and vehicle", "Problem-solving skills"],
    whyAiResistant: "Every job site is unique, requiring physical problem-solving and customer interaction in unpredictable situations."
  }
]

const categories = [
  "All Categories",
  "Healthcare & Wellness", 
  "Skilled Trades",
  "Creative Arts",
  "Human Services",
  "Education & Training",
  "Sales & Relations",
  "Leadership & Management",
  "Entrepreneurship"
]

const aiResistanceLevels = ["All Levels", "High", "Medium"]
const experienceLevels = ["All Experience", "0-2 years", "2-5 years", "5+ years"]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedResistance, setSelectedResistance] = useState("All Levels")
  const [selectedExperience, setSelectedExperience] = useState("All Experience")
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const filteredJobs = sampleJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || job.category === selectedCategory
    const matchesResistance = selectedResistance === "All Levels" || job.aiResistance === selectedResistance
    const matchesExperience = selectedExperience === "All Experience" || job.experience === selectedExperience

    return matchesSearch && matchesLocation && matchesCategory && matchesResistance && matchesExperience
  })

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getResistanceBadgeColor = (level: string) => {
    switch (level) {
      case "High": return "bg-green-100 text-green-800 border-green-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Resistance</label>
                  <select
                    value={selectedResistance}
                    onChange={(e) => setSelectedResistance(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {aiResistanceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
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
            Found <span className="font-semibold">{filteredJobs.length}</span> AI-resistant jobs
          </p>
        </div>

        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getResistanceBadgeColor(job.aiResistance)}`}>
                      <Shield className="inline h-3 w-3 mr-1" />
                      {job.aiResistance} AI-Resistance
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
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.experience}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {job.category}
                    </span>
                    {job.isRemote && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-2">
                        Remote
                      </span>
                    )}
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

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Why this job is AI-resistant:</h4>
                    <p className="text-sm text-green-800">{job.whyAiResistant}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Apply Now</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
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
                setSelectedResistance("All Levels")
                setSelectedExperience("All Experience")
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