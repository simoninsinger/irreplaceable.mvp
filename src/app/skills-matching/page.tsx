"use client"

import { useState, useEffect } from "react"
import { 
  Target, 
  User, 
  Plus,
  X,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Lightbulb,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Shield,
  ExternalLink,
  Settings,
  BookOpen
} from "lucide-react"

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
  yearsExperience?: number
}

interface UserProfile {
  skills: Skill[]
  preferences: {
    location: string
    remoteWork: boolean
    salaryMin: number
    categories: string[]
  }
}

interface SkillMatch {
  job: any
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
}

const skillCategories = [
  'Healthcare',
  'Skilled Trades', 
  'Education',
  'Creative Arts',
  'Human Services',
  'Personal Services'
]

export default function SkillsMatchingPage() {
  const [userEmail, setUserEmail] = useState("")
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>([])
  const [availableSkills, setAvailableSkills] = useState<{[key: string]: string[]}>({})
  
  // Profile form state
  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    preferences: {
      location: '',
      remoteWork: false,
      salaryMin: 0,
      categories: []
    }
  })

  // New skill form state
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Intermediate' as const,
    category: 'Healthcare',
    yearsExperience: ''
  })

  const [showAddSkill, setShowAddSkill] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || ""
    setUserEmail(storedEmail)
    
    // Load available skills
    loadAvailableSkills()
    
    if (storedEmail) {
      loadSkillMatches(storedEmail)
    }
  }, [])

  const loadAvailableSkills = async () => {
    try {
      const response = await fetch('/api/skills-matching', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await response.json()
      if (data.success) {
        setAvailableSkills(data.data.allSkills)
      }
    } catch (error) {
      console.error('Error loading skills:', error)
    }
  }

  const loadSkillMatches = async (email: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/skills-matching?email=${encodeURIComponent(email)}&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        setSkillMatches(data.data.matches)
        setMessage("")
      } else {
        setMessage(data.message || "No skill profile found. Please create one first.")
        setShowProfileForm(true)
      }
    } catch (error) {
      console.error('Error loading skill matches:', error)
      setMessage("Error loading matches. Please create a skill profile first.")
      setShowProfileForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSkillProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/skills-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          skills: profile.skills,
          preferences: profile.preferences
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Skill profile saved successfully!")
        setShowProfileForm(false)
        loadSkillMatches(userEmail)
      } else {
        setMessage(data.message || "Error saving profile")
      }
    } catch (error) {
      setMessage("Error saving skill profile")
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.name && newSkill.category) {
      const skill: Skill = {
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category,
        yearsExperience: newSkill.yearsExperience ? parseInt(newSkill.yearsExperience) : undefined
      }
      
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      
      setNewSkill({
        name: '',
        level: 'Intermediate',
        category: 'Healthcare',
        yearsExperience: ''
      })
      setShowAddSkill(false)
    }
  }

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const toggleCategory = (category: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        categories: prev.preferences.categories.includes(category)
          ? prev.preferences.categories.filter(c => c !== category)
          : [...prev.preferences.categories, category]
      }
    }))
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    if (score >= 40) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800'
      case 'Advanced': return 'bg-blue-100 text-blue-800'
      case 'Intermediate': return 'bg-green-100 text-green-800'
      case 'Beginner': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatSalary = (salary?: { min?: number; max?: number; currency: string; period: string }) => {
    if (!salary) return 'Salary not listed'
    const { min, max } = salary
    const formatAmount = (amount: number) => `$${(amount / 1000).toFixed(0)}k`
    if (min && max) return `${formatAmount(min)} - ${formatAmount(max)}`
    if (min) return `${formatAmount(min)}+`
    return 'Salary not listed'
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Enter Your Email</h2>
            <p className="text-gray-600">We need your email to create your skill profile</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const email = (e.target as any).email.value
            localStorage.setItem('userEmail', email)
            setUserEmail(email)
            loadSkillMatches(email)
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
                <Target className="h-8 w-8 mr-3 text-blue-600" />
                Skills-Based Job Matching
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Get personalized job recommendations based on your skills and career preferences.
              </p>
            </div>
            <button
              onClick={() => setShowProfileForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('Error') ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center">
              {message.includes('Error') ? 
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" /> :
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              }
              <span className={message.includes('Error') ? 'text-red-800' : 'text-blue-800'}>{message}</span>
            </div>
          </div>
        )}

        {/* Skill Profile Form */}
        {showProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create Your Skill Profile</h2>
                  <button
                    onClick={() => setShowProfileForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={saveSkillProfile} className="space-y-8">
                  {/* Skills Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Your Skills</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddSkill(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    {/* Add Skill Form */}
                    {showAddSkill && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                            <input
                              type="text"
                              value={newSkill.name}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Patient Care"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={newSkill.category}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              {skillCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <select
                              value={newSkill.level}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Years (optional)</label>
                            <input
                              type="number"
                              value={newSkill.yearsExperience}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, yearsExperience: e.target.value }))}
                              placeholder="3"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <button
                            type="button"
                            onClick={addSkill}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            Add Skill
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddSkill(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Current Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.skills.map((skill, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{skill.name}</div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                                {skill.level}
                              </span>
                              <span>{skill.category}</span>
                              {skill.yearsExperience && <span>• {skill.yearsExperience} yrs</span>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                        <input
                          type="text"
                          value={profile.preferences.location}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, location: e.target.value }
                          }))}
                          placeholder="e.g., San Francisco, CA"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                        <input
                          type="number"
                          value={profile.preferences.salaryMin}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, salaryMin: parseInt(e.target.value) || 0 }
                          }))}
                          placeholder="50000"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.preferences.remoteWork}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, remoteWork: e.target.checked }
                          }))}
                          className="mr-2 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Open to remote work</span>
                      </label>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Categories</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {skillCategories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={profile.preferences.categories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="mr-2 rounded"
                            />
                            <span className="text-sm">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading || profile.skills.length === 0}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
                    >
                      {isLoading ? 'Saving...' : 'Save Profile & Find Matches'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileForm(false)}
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

        {/* Job Matches */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-2">Finding your perfect matches...</p>
          </div>
        ) : skillMatches.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Job Matches ({skillMatches.length})
              </h2>
              <p className="text-sm text-gray-600">Sorted by skill match percentage</p>
            </div>

            {skillMatches.map((match, index) => (
              <div key={match.job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{match.job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.matchScore)}`}>
                        {match.matchScore.toFixed(0)}% Match
                      </span>
                      <span className="px-2 py-1 text-xs font-medium border rounded-full bg-green-100 text-green-800 border-green-200">
                        <Shield className="inline h-3 w-3 mr-1" />
                        {match.job.aiResistanceScore}/10 AI-Resistance
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {match.job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {match.job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(match.job.salary)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{match.job.description}</p>

                {/* Skill Match Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {match.matchedSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Your Matching Skills ({match.matchedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.missingSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Skills to Develop ({match.missingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.slice(0, 3).map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {match.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Skill Development Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {match.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start">
                          <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-3">
                  <a 
                    href={match.job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Apply Now</span>
                  </a>
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Learn Skills</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Matches Found</h3>
            <p className="text-gray-600 mb-4">Create a skill profile to get personalized job recommendations.</p>
            <button
              onClick={() => setShowProfileForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Skill Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}